import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CutoutService {
  private updateFunctions = new Set<() => void>();
  private animationFrameId: number | null = null;

  constructor(private ngZone: NgZone) {}

  register(fn: () => void) {
    this.updateFunctions.add(fn);
  }

  unregister(fn: () => void) {
    this.updateFunctions.delete(fn);
  }

  updateAll() {
    this.updateFunctions.forEach(fn => fn());
  }

  animateLayoutChanges(durationMs: number = 600) {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const startTime = performance.now();

    this.ngZone.runOutsideAngular(() => {
      const loop = () => {
        this.updateAll();
        
        if (performance.now() - startTime < durationMs) {
          this.animationFrameId = requestAnimationFrame(loop);
        }
      };
      this.animationFrameId = requestAnimationFrame(loop);
    });
  }
}