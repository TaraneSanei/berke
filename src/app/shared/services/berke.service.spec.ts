import { TestBed } from '@angular/core/testing';

import { BerkeService } from './berke.service';

describe('BerkeService', () => {
  let service: BerkeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BerkeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
