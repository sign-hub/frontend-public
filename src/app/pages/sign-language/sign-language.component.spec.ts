import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLanguageComponent } from './sign-language.component';

describe('SignLanguageComponent', () => {
  let component: SignLanguageComponent;
  let fixture: ComponentFixture<SignLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
