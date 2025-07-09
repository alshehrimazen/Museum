import { TestBed } from '@angular/core/testing';

import { InvolvementService } from './involvement.service';

describe('InvolvementService', () => {
  let service: InvolvementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvolvementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
