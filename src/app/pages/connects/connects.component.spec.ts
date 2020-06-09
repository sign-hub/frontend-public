import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectsComponent } from './connects.component';

describe('ConnectsComponent', () => {
  let component: ConnectsComponent;
  let fixture: ComponentFixture<ConnectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
