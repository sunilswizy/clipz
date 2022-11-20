import { TestBed } from '@angular/core/testing';

import { ClipzService } from './clipz.service';

describe('ClipzService', () => {
  let service: ClipzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
