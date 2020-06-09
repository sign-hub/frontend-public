import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarFeatureComponent } from './grammar-feature.component';

describe('GrammarFeatureComponent', () => {
  let component: GrammarFeatureComponent;
  let fixture: ComponentFixture<GrammarFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrammarFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrammarFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
