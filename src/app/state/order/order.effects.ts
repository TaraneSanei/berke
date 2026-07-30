import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, switchMap, map, catchError, of } from "rxjs";
import { DataService } from "../../shared/services/data.service";
import { BerkeService } from "../../shared/services/berke.service";
import {
  loadOrders,
  loadOrdersSuccess,
  loadOrdersFailure,
  newOrder,
  newOrderSuccess,
  newOrderFailure,
  verifyOrder,
  verifyOrderSuccess,
  verifyOrderFailure
} from "./order.actions";

@Injectable()
export class OrderEffects {
  private actions$ = inject(Actions);
  private dataService = inject(DataService);
  private berkeService = inject(BerkeService);

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrders),
      mergeMap(() =>
        this.dataService.getOrderHistory().pipe(
          map((orders) => loadOrdersSuccess({ orders })),
          catchError((response) =>
            of(loadOrdersFailure({ error: response.error }))
          )
        )
      )
    )
  );

  newOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newOrder),
      switchMap((action) =>
        this.berkeService
          .order(action.plan, action.discountCode)
          .pipe(
            map((result) => newOrderSuccess({ result })),
            catchError((response) =>
              of(newOrderFailure({ error: response.error }))
            )
          )
      )
    )
  );

  verifyOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(verifyOrder),
      switchMap((action) =>
        this.berkeService.verify(action.authority).pipe(
          map((result) => verifyOrderSuccess({ result })),
          catchError((response) =>
            of(verifyOrderFailure({ error: response.error }))
          )
        )
      )
    )
  );
}
