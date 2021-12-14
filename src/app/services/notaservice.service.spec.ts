import { TestBed } from '@angular/core/testing';

import { NotaService } from './nota.service';

describe('NotaserviceService', () => {
  let service: NotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
