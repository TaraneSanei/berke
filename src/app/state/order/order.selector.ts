import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const SelectOrder = (state: AppState) => state.order

export const selectOrders = createSelector(
  SelectOrder,
  (state) => state.orders
);

export const selectNewOrderResult = createSelector(
  SelectOrder,
  (state) => state.newOrderResult
);

export const selectNewOrderStatus = createSelector(
  SelectOrder,
  (state) => state.newOrderStatus
);
export const selectOrdersStatus = createSelector(SelectOrder,
  (s) => s.ordersStatus);

export const selectVerifyStatus = createSelector(SelectOrder, (s) => s.verifyStatus);


export const selectLatestOrder = createSelector(selectOrders, (orders) => orders[0] ?? null);
export const selectLatestOrderPlanId = createSelector(
  selectLatestOrder,
  (order) => order?.plan.id ?? null
);