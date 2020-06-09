import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationSignLanguageComponent } from './navigation-sign-language.component';

describe('NavigationSignLanguageComponent', () => {
  let component: NavigationSignLanguageComponent;
  let fixture: ComponentFixture<NavigationSignLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationSignLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationSignLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
