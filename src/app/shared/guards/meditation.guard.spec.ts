import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { meditationGuard } from './meditation.guard';

describe('meditationGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => meditationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
