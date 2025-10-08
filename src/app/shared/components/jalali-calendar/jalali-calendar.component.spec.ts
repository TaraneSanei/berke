import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JalaliCalendarComponent } from './jalali-calendar.component';

describe('JalaliCalendarComponent', () => {
  let component: JalaliCalendarComponent;
  let fixture: ComponentFixture<JalaliCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JalaliCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JalaliCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
