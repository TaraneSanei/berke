// verify.component.ts
import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

import { loadOrders, verifyOrder } from '../state/order/order.actions';
import { selectLatestOrderPlanId, selectOrdersStatus, selectVerifyStatus } from '../state/order/order.selector';

@Component({
  selector: 'app-verify',
  imports: [Toast],
  providers: [MessageService],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css',
})
export class VerifyComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private messageService = inject(MessageService);

  private verifyStatus = toSignal(this.store.select(selectVerifyStatus));
  private ordersStatus = toSignal(this.store.select(selectOrdersStatus));
  private latestPlanId = toSignal(this.store.select(selectLatestOrderPlanId));

  private handledVerify = false;
  private redirecting = false;

  constructor() {
    // Verify outcome
    effect(() => {
      const status = this.verifyStatus();
      if (this.handledVerify) return;

      if (status === 'success') {
        this.handledVerify = true;
        this.messageService.add({
          severity: 'success',
          summary: 'پرداخت موفق',
          detail: 'پرداخت شما با موفقیت تأیید و اشتراک فعال شد.',
          life: 4000,
        });
        this.router.navigate(['/profile']);
      } else if (status === 'error') {
        // Status was OK but verification returned failure → possible 72h refund
        this.handledVerify = true;
        this.messageService.add({
          severity: 'warn',
          summary: 'تأیید پرداخت ناموفق',
          detail:
            'پرداخت شما تأیید نشد. در صورتی که مبلغی از حساب شما کسر شده باشد، تا ۷۲ ساعت آینده بازگردانده می‌شود. در صورت نیاز با پشتیبانی تماس بگیرید.',
          life: 9000,
          sticky: true,
        });
        this.store.dispatch(loadOrders());
      }
    });

    // After orders reload → redirect back to subscription with the last plan
    effect(() => {
      const status = this.ordersStatus();
      if (this.redirecting) return;
      if (status === 'success' || status === 'error') {
        this.redirecting = true;
        const planId = this.latestPlanId();
        this.router.navigate(['/subscription'], {
          queryParams: planId ? { plan: planId } : {},
        });
      }
    });
  }

  ngOnInit(): void {
    const authority = this.route.snapshot.queryParamMap.get('Authority');
    const payStatus = this.route.snapshot.queryParamMap.get('Status'); // OK | NOK

    if (payStatus === 'OK' && authority) {
      this.store.dispatch(verifyOrder({ authority }));
    } else {
      // NOK or missing → payment definitely failed, no need to call verify
      this.messageService.add({
        severity: 'error',
        summary: 'پرداخت ناموفق',
        detail: 'پرداخت انجام نشد یا توسط شما لغو شد.',
        life: 6000,
      });
      this.store.dispatch(loadOrders());
    }
  }
}
