import { Directive, ElementRef, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { CutoutService } from '../services/cutout.service';

@Directive({
  selector: '[appWindow]'
})
export class WindowDirective implements AfterViewInit, OnDestroy {
  private rectEl?: SVGRectElement;
  private resizeObserver?: ResizeObserver;

  @Input() opacity: number = 1;

  constructor(
    private el: ElementRef, 
    private cutoutService: CutoutService // Inject the service
  ) {}

  ngAfterViewInit() {
    const cutoutGroup = document.querySelector<SVGGElement>('#cutouts');
    if (!cutoutGroup) return;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('fill', `rgba(0,0,0,${this.opacity})`);
    
    // Optional: Add a transition to the SVG rect itself for extra smoothness
    // rect.style.transition = 'x 0.1s, y 0.1s, width 0.1s, height 0.1s'; 
    
    cutoutGroup.appendChild(rect);
    this.rectEl = rect;

    // 1. Register this directive with the service
    this.cutoutService.register(this.updateRect);
    this.updateRect();

    // 2. Watch element size
    this.resizeObserver = new ResizeObserver(() => {
        // CRITICAL CHANGE: When I resize, I tell the Service to update EVERYONE
        // This fixes the "subsequent divs don't know" issue.
        this.cutoutService.updateAll();
    });
    this.resizeObserver.observe(this.el.nativeElement);

    window.addEventListener('scroll', this.updateRect, true);
  }

  ngOnDestroy() {
    // Unregister to prevent memory leaks
    this.cutoutService.unregister(this.updateRect);
    this.rectEl?.remove();
    this.resizeObserver?.disconnect();
    window.removeEventListener('scroll', this.updateRect, true);
  }

  // Changed to an arrow function so 'this' is preserved when called by Service
  private updateRect = () => {
    if (!this.rectEl) return;
    
    const bounds = this.el.nativeElement.getBoundingClientRect();
    const styles = getComputedStyle(this.el.nativeElement);

    // Using setAttributeNS is slightly safer for SVG, but setAttribute is usually fine
    this.rectEl.setAttribute('x', `${bounds.left}`);
    this.rectEl.setAttribute('y', `${bounds.top}`);
    this.rectEl.setAttribute('width', `${bounds.width}`);
    this.rectEl.setAttribute('height', `${bounds.height}`);

    const radius = parseFloat(styles.borderRadius || '0');
    this.rectEl.setAttribute('rx', `${radius}`);
    this.rectEl.setAttribute('ry', `${radius}`);
  }
}