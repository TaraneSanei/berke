import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { buildJalaliMonth, JalaliDay } from '../../utils/jalali.calendar';
import * as jalali from 'jalaali-js';
import { CommonModule } from '@angular/common';
import { PersianDigitsPipe } from '../../pipes/persian-digits.pipe';
import { ButtonModule } from 'primeng/button';
import { CalendarSummary } from '../../../models/data.models';

@Component({
  selector: 'app-jalali-calendar',
  standalone: true,
  imports: [
    CommonModule,
    PersianDigitsPipe,
    ButtonModule
  ],
  templateUrl: './jalali-calendar.component.html',
  styleUrl: './jalali-calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class JalaliCalendarComponent implements OnInit {

  @Input() year!: number;
  @Input() month!: number;
  @Input() monthSummaryMap: Map<string, CalendarSummary> = new Map();
  @Output() dateSelected = new EventEmitter<{ jy: number; jm: number; jd: number; gregorian: Date }>();
  @Output() monthChanged = new EventEmitter<{ year: number; month: number }>();
  days: JalaliDay[] = [];
Math = Math;
  weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']; // Saturday..Friday (sh, ya, do, se, ch, pa, j)
  monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  selected?: { jy: number; jm: number; jd: number };


  ngOnInit() {
    const now = new Date();
    const { jy, jm, jd } = jalali.toJalaali(now);
    this.year = this.year ?? jy;
    this.month = this.month ?? jm;
    this.selectDate({ jy, jm, jd, gregorian: now, isCurrentMonth: true });
    this.generate();

  }


  generate() {
    this.days = buildJalaliMonth(this.year, this.month);
    this.monthChanged.emit({ year: this.year, month: this.month });
  }

  prevMonth() {
    this.month--;
    if (this.month < 1) { this.month = 12; this.year--; }
    this.generate();
  }

  nextMonth() {
    this.month++;
    if (this.month > 12) { this.month = 1; this.year++; }
    this.generate();
  }


  getKey(d: JalaliDay) { return `${d.jy}-${d.jm}-${d.jd}`; }

  getSummaryForDay(day: JalaliDay): CalendarSummary | undefined {
    const dateKey = day.gregorian.getFullYear() + '-' +
      String(day.gregorian.getMonth() + 1).padStart(2, '0') + '-' +
      String(day.gregorian.getDate()).padStart(2, '0');

    return this.monthSummaryMap.get(dateKey);
  }

  selectDate(day: JalaliDay) {
    if (!day.isCurrentMonth) {
      this.year = day.jy;
      this.month = day.jm;
      this.generate();
    }
    this.selected = { jy: day.jy, jm: day.jm, jd: day.jd };
    this.dateSelected.emit({ jy: day.jy, jm: day.jm, jd: day.jd, gregorian: day.gregorian });
    console.log('selected jalali', day.jy, day.jm, day.jd, 'gregorian', day.gregorian);

  }


  isToday(day: JalaliDay) {
    const now = new Date();
    const { jy, jm, jd } = jalali.toJalaali(now);
    return day.jy === jy && day.jm === jm && day.jd === jd;
  }

  isSelected(day: JalaliDay) {
    return this.selected && this.selected.jy === day.jy && this.selected.jm === day.jm && this.selected.jd === day.jd;
  }

  trackByDay(_: number, d: JalaliDay) {
    return `${d.jy}-${d.jm}-${d.jd}`;
  }


}
