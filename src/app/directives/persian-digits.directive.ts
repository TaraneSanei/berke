import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[pInputText], input[pinputotp], input[pInputNumber], input, textarea', 
})
export class PersianDigitsDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  private toPersian = (s: string) => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;
    input.value = this.toPersian(input.value);
  }

}
