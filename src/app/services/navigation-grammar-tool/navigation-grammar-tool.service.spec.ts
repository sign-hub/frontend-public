import { TestBed } from '@angular/core/testing';

import { NavigationGrammarToolService } from './navigation-grammar-tool.service';

describe('NavigationGrammarToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigationGrammarToolService = TestBed.get(NavigationGrammarToolService);
    expect(service).toBeTruthy();
  });
});
