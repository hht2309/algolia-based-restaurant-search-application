import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinePreloaderComponent } from './timeline-preloader.component';

describe('TimelinePreloaderComponent', () => {
  let component: TimelinePreloaderComponent;
  let fixture: ComponentFixture<TimelinePreloaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelinePreloaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinePreloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
