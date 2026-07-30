import { createReducer, on } from '@ngrx/store';
import { Order, NewOrderResult, VerifyResult } from '../../models/data.models';
import * as OrderActions from './order.actions';

export type AsyncStatus = 'pending' | 'loading' | 'success' | 'error';

export interface OrderState {
  orders: Order[];
  newOrderResult: NewOrderResult | null;
  verifyResult: VerifyResult | null;
  ordersStatus: AsyncStatus;
  newOrderStatus: AsyncStatus;
  verifyStatus: AsyncStatus;
  error: string;
}

export const initialOrderState: OrderState = {
  orders: [],
  newOrderResult: null,
  verifyResult: null,
  ordersStatus: 'pending',
  newOrderStatus: 'pending',
  verifyStatus: 'pending',
  error: ''
};

export const orderReducer = createReducer(
  initialOrderState,

  // Load Orders
  on(OrderActions.loadOrders, (state) => ({
    ...state,
    ordersStatus: 'loading' as const
  })),
  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    ordersStatus: 'success' as const,
    error: ''
  })),
  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    ordersStatus: 'error' as const,
    error
  })),

  // New Order
  on(OrderActions.newOrder, (state) => ({
    ...state,
    newOrderResult: null,
    newOrderStatus: 'loading' as const
  })),
  on(OrderActions.newOrderSuccess, (state, { result }) => ({
    ...state,
    newOrderResult: result,
    newOrderStatus: 'success' as const,
    error: ''
  })),
  on(OrderActions.newOrderFailure, (state, { error }) => ({
    ...state,
    newOrderStatus: 'error' as const,
    error
  })),

  // Verify Order
  on(OrderActions.verifyOrder, (state) => ({
    ...state,
    verifyResult: null,
    verifyStatus: 'loading' as const
  })),
  on(OrderActions.verifyOrderSuccess, (state, { result }) => ({
    ...state,
    verifyResult: result,
    verifyStatus: 'success' as const,
    error: ''
  })),
  on(OrderActions.verifyOrderFailure, (state, { error }) => ({
    ...state,
    verifyStatus: 'error' as const,
    error
  })),

  // Clear (called on logout via clear-state.reducer)
  on(OrderActions.clearOrderState, () => ({ ...initialOrderState }))
);
