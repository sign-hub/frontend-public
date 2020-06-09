import { TestBed } from '@angular/core/testing';

import { SignLanguagesService } from './sign-languages.service';

describe('SignLanguagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignLanguagesService = TestBed.get(SignLanguagesService);
    expect(service).toBeTruthy();
  });
});
