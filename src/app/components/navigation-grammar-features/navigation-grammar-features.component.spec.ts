import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationGrammarFeaturesComponent } from './navigation-grammar-features.component';

describe('NavigationGrammarFeaturesComponent', () => {
  let component: NavigationGrammarFeaturesComponent;
  let fixture: ComponentFixture<NavigationGrammarFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationGrammarFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationGrammarFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
