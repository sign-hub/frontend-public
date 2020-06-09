import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalArchiveComponent } from './digital-archive.component';

describe('DigitalArchiveComponent', () => {
  let component: DigitalArchiveComponent;
  let fixture: ComponentFixture<DigitalArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
