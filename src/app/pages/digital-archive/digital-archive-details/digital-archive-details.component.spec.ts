import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalArchiveDetailsComponent } from './digital-archive-details.component';

describe('DigitalArchiveDetailsComponent', () => {
  let component: DigitalArchiveDetailsComponent;
  let fixture: ComponentFixture<DigitalArchiveDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalArchiveDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalArchiveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
