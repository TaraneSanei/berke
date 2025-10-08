import { Component, Input, OnChanges } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { emotionIconMap } from '../../utils/emotion.map'


@Component({
  selector: 'app-emotion-icon',
  imports: [],
  templateUrl: './emotion-icon.component.html',
  styleUrl: './emotion-icon.component.css'
})
export class EmotionIconComponent implements OnChanges {
  @Input() emotion: string = '';
  iconSvg: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(): void {
    const raw = emotionIconMap[this.emotion] || '';
    this.iconSvg = this.sanitizer.bypassSecurityTrustHtml(raw);
  }
}