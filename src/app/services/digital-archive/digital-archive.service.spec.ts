import { TestBed } from '@angular/core/testing';

import { DigitalArchiveService } from './digital-archive.service';

describe('DigitalArchiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DigitalArchiveService = TestBed.get(DigitalArchiveService);
    expect(service).toBeTruthy();
  });
});
