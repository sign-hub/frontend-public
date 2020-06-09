import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigngramComponent } from './signgram.component';

describe('SigngramComponent', () => {
  let component: SigngramComponent;
  let fixture: ComponentFixture<SigngramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigngramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigngramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
