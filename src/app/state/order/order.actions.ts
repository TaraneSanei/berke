import { createAction, props } from '@ngrx/store';
import { Order, NewOrderResult, SubscriptionPlan, VerifyResult } from '../../models/data.models';

// Load order history
export const loadOrders = createAction('[Order] Load Orders');

export const loadOrdersSuccess = createAction(
  '[Order] Load Orders Success',
  props<{ orders: Order[] }>()
);

export const loadOrdersFailure = createAction(
  '[Order] Load Orders Failure',
  props<{ error: any }>()
);

// New Order
export const newOrder = createAction(
  '[Order] New Order',
  props<{ plan: SubscriptionPlan; discountCode?: string }>()
);

export const newOrderSuccess = createAction(
  '[Order] New Order Success',
  props<{ result: NewOrderResult }>()
);

export const newOrderFailure = createAction(
  '[Order] New Order Failure',
  props<{ error: any }>()
);

// Verify Payment
export const verifyOrder = createAction(
  '[Order] Verify Order',
  props<{ authority: string }>()
);

export const verifyOrderSuccess = createAction(
  '[Order] Verify Order Success',
  props<{ result: VerifyResult }>()
);

export const verifyOrderFailure = createAction(
  '[Order] Verify Order Failure',
  props<{ error: any }>()
);

export const clearOrderState = createAction('[Order] Clear State');
