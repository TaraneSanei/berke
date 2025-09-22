import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianDigits'
})
export class PersianDigitsPipe implements PipeTransform {

  private persianNumbers = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];

  transform(value: unknown, ...args: unknown[]): string {
    if (value == null) return '';
    return value.toString().replace(/\d/g, d => this.persianNumbers[+d]);
  }

}
