import { ActionReducer } from '@ngrx/store';
import { logout } from '../user/user.actions';

export function clearStateMetaReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return (state, action) => {
    if (action.type === logout.type) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
