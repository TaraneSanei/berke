import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { BerkeService } from '../shared/services/berke.service';
import { SubscriptionPlan } from '../models/data.models';
import { AppState } from '../state/app.state';
import { newOrder } from '../state/order/order.actions';
import { selectNewOrderResult } from '../state/order/order.selector';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';

@Component({
  selector: 'app-subscription',
  imports: [
    PersianDigitsPipe,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {
  private route = inject(ActivatedRoute);
  private berkeService = inject(BerkeService);
  private store: Store<AppState> = inject(Store);

  private plans = this.berkeService.subscriptionPlans;

  /** planId from the URL, reactive so re-navigation inside the component works */
  private planId = toSignal(
    this.route.paramMap.pipe(),
    { initialValue: this.route.snapshot.paramMap }
  );

  /** Selected plan is derived from the loaded plans + route param */
  selectedPlan = computed<SubscriptionPlan | undefined>(() => {
    const id = Number(this.planId()?.get('planId'));
    if (!id) return undefined;
    return this.plans().find(p => p.id === id);
  });

  /** True only once plans are loaded and the id still matches nothing */
  planNotFound = computed(
    () => this.plans().length > 0 && !this.selectedPlan()
  );

  // ---- discount state ----
  discountCode = '';
  agreedToTerms = false;

  applyingDiscount = signal(false);
  discountValid = signal(false);
  discountMessage = signal<string | null>(null);

  /** Price returned by the server after applying the code. null = no discount */
  private discountedPrice = signal<number | null>(null);

  /** Single source of truth for what the user pays */
  finalPrice = computed(
    () => this.discountedPrice() ?? this.selectedPlan()?.price
  );

  /** Show the struck-through original only when a discount is actually active */
  hasDiscount = computed(() => this.discountedPrice() !== null);

  private newOrderResult = toSignal(
    this.store.select(selectNewOrderResult),
    { initialValue: null }
  );

  constructor() {
    this.berkeService.loadSubscriptionPlans();

    // Reset any applied discount if the plan changes underneath us
    effect(() => {
      this.selectedPlan();
      this.resetDiscount();
    });

    // Hand off to the gateway as soon as the order comes back
    effect(() => {
      const result = this.newOrderResult();
      const url = result?.paymentUrl ?? (result as any)?.payment_url;
      if (url) {
        window.location.href = url;
      }
    });
  }

  applyDiscount(): void {
    const code = this.discountCode?.trim();
    const plan = this.selectedPlan();

    if (!code || !plan) {
      this.discountValid.set(false);
      this.discountedPrice.set(null);
      this.discountMessage.set('کد تخفیف را وارد کنید.');
      return;
    }

    this.applyingDiscount.set(true);
    this.discountMessage.set(null);

    this.berkeService.verifyDiscountCode(code, plan.id).subscribe({
      next: (res: any) => {
        this.applyingDiscount.set(false);

        const price =
          res?.discounted_price ?? res?.final_price ?? res?.finalPrice;

        // Backend may answer 200 with valid:false
        if (res?.valid === false || price === undefined || price === null) {
          this.discountValid.set(false);
          this.discountedPrice.set(null);
          this.discountMessage.set(res?.message ?? 'کد تخفیف معتبر نیست.');
          return;
        }

        this.discountValid.set(true);
        this.discountedPrice.set(Number(price));
        this.discountMessage.set(res?.message ?? 'کد تخفیف اعمال شد.');
      },
      error: (err) => {
        this.applyingDiscount.set(false);
        this.discountValid.set(false);
        this.discountedPrice.set(null);
        this.discountMessage.set(
          err?.error?.message ??
          err?.error?.detail ??
          'کد تخفیف معتبر نیست.'
        );
      }
    });
  }

  clearDiscount(): void {
    this.discountCode = '';
    this.resetDiscount();
  }

  proceedToPayment(): void {
    const plan = this.selectedPlan();
    if (!plan || !this.agreedToTerms) return;

    this.store.dispatch(
      newOrder({
        plan,
        discountCode: this.discountValid()
          ? this.discountCode.trim()
          : undefined
      })
    );
  }

  private resetDiscount(): void {
    this.discountValid.set(false);
    this.discountedPrice.set(null);
    this.discountMessage.set(null);
  }
}
