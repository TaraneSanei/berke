import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appWindow]'
})
export class WindowDirective {

   private rectEl?: SVGRectElement;

  constructor(private el: ElementRef) {}

  @Input() opacity: number = 1;
  ngAfterViewInit() {
    const cutoutGroup = document.querySelector<SVGGElement>('#cutouts');
    if (!cutoutGroup) return;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('fill', `rgba(0,0,0,${this.opacity})`);
    cutoutGroup.appendChild(rect);
    this.rectEl = rect;

    this.updateRect();

    window.addEventListener('resize', this.updateRect);
    window.addEventListener('scroll', this.updateRect, true);
  }

  ngOnDestroy() {
    this.rectEl?.remove();
    window.removeEventListener('resize', this.updateRect);
    window.removeEventListener('scroll', this.updateRect, true);
  }

  private updateRect = () => {
    const bounds = this.el.nativeElement.getBoundingClientRect();
    const styles = getComputedStyle(this.el.nativeElement);
    this.rectEl?.setAttribute('x', `${bounds.left}`);
    this.rectEl?.setAttribute('y', `${bounds.top}`);
    this.rectEl?.setAttribute('width', `${bounds.width}`);
    this.rectEl?.setAttribute('height', `${bounds.height}`);
    this.rectEl?.setAttribute('rx', '12');
    const radius = parseFloat(styles.borderRadius || '0');
    this.rectEl?.setAttribute('rx', `${radius}`);
    this.rectEl?.setAttribute('ry', `${radius}`)
  }
}
