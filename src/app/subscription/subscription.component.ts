import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BerkeService } from '../shared/services/berke.service';
import { SubscriptionPlan } from '../models/data.models';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

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
  private plans = this.berkeService.subscriptionPlans
  selectedPlan: SubscriptionPlan | undefined;
  discountCode: string = '';
  agreedToTerms: boolean = false;

  constructor() {
    this.berkeService.loadSubscriptionPlans()
    const planId = Number(this.route.snapshot.paramMap.get('planId'));

    effect(() => {
    if (planId) {
      this.selectedPlan = this.plans().find(p => p.id == planId);
    } else {
      //error handling, this subscription plan or this page doesn't exist.
    }})
  }

  applyDiscount() {
    console.log('Discount code applied:', this.discountCode);
    // Add logic here
  }

proceedToPayment(plan: SubscriptionPlan) {
  this.berkeService.order(plan).subscribe({
    next: (response: any) => {
      if (response && response.payment_url) {
        window.location.href = response.payment_url;
      }
    },
    error: (err) => {
      console.error('Payment initiation failed', err);
    }
  });
}
}
