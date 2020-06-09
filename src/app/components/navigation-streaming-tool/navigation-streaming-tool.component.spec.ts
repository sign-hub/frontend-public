import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationStreamingToolComponent } from './navigation-streaming-tool.component';

describe('NavigationStreamingToolComponent', () => {
  let component: NavigationStreamingToolComponent;
  let fixture: ComponentFixture<NavigationStreamingToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationStreamingToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationStreamingToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
