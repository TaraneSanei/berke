import { CanDeactivateFn } from '@angular/router';
import { PlayComponent } from '../../play/play.component';
import { of } from 'rxjs';

export const meditationGuard: CanDeactivateFn<PlayComponent> = (component, currentRoute, currentState, nextState) => {
    return component.endSession();
  };
