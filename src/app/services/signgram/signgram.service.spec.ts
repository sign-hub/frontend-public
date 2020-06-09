import { TestBed } from '@angular/core/testing';

import { SigngramService } from './signgram.service';

describe('SigngramService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SigngramService = TestBed.get(SigngramService);
    expect(service).toBeTruthy();
  });
});
