import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appWindow]'
})
export class WindowDirective {
  private rectEl?: SVGRectElement;
  private resizeObserver?: ResizeObserver;

  @Input() opacity: number = 1;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const cutoutGroup = document.querySelector<SVGGElement>('#cutouts');
    if (!cutoutGroup) return;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('fill', `rgba(0,0,0,${this.opacity})`);
    cutoutGroup.appendChild(rect);
    this.rectEl = rect;

    this.updateRect();

    // watch element size
    this.resizeObserver = new ResizeObserver(() => this.updateRect());
    this.resizeObserver.observe(this.el.nativeElement);

    // watch scroll
    window.addEventListener('scroll', this.updateRect, true);
  }

  ngOnDestroy() {
    this.rectEl?.remove();
    this.resizeObserver?.disconnect();
    window.removeEventListener('scroll', this.updateRect, true);
  }

  private updateRect = () => {
    const bounds = this.el.nativeElement.getBoundingClientRect();
    const styles = getComputedStyle(this.el.nativeElement);

    this.rectEl?.setAttribute('x', `${bounds.left}`);
    this.rectEl?.setAttribute('y', `${bounds.top}`);
    this.rectEl?.setAttribute('width', `${bounds.width}`);
    this.rectEl?.setAttribute('height', `${bounds.height}`);

    const radius = parseFloat(styles.borderRadius || '0');
    this.rectEl?.setAttribute('rx', `${radius}`);
    this.rectEl?.setAttribute('ry', `${radius}`);
  }
}
