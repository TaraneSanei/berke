import { TestBed } from '@angular/core/testing';

import { CutoutService } from './cutout.service';

describe('CutoutService', () => {
  let service: CutoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CutoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
