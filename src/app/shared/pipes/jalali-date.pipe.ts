import { Pipe, PipeTransform } from '@angular/core';
import * as jalaali from 'jalaali-js';

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

@Pipe({
  name: 'jalaliDate'
})
export class JalaliDatePipe implements PipeTransform {

  transform(value: Date | string | number, format: string = 'yyyy/mm/dd'): string {
    if (!value) return '';

    const date = new Date(value);
    const { jy, jm, jd } = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());

    switch (format) {
      case 'yyyy/mm/dd':
        return `${jy}/${this.pad(jm)}/${this.pad(jd)}`;
      case 'dd/mm/yyyy':
        return `${this.pad(jd)}/${this.pad(jm)}/${jy}`;
      case 'longDate':
        return `${this.pad(jd)} ${persianMonths[jm - 1]} ${jy}`;
      default:
        return `${jy}/${this.pad(jm)}/${this.pad(jd)}`;
    }
  }

  private pad(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }
}