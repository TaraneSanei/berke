import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CutoutService {
  private updateFunctions = new Set<() => void>();
  private animationFrameId: number | null = null;

  constructor(private ngZone: NgZone) {}

  // 1. Directives register themselves here
  register(fn: () => void) {
    this.updateFunctions.add(fn);
  }

  unregister(fn: () => void) {
    this.updateFunctions.delete(fn);
  }

  // 2. The "Nuclear Option": Force everyone to update positions immediately
  // Call this when a ResizeObserver fires
  updateAll() {
    this.updateFunctions.forEach(fn => fn());
  }

  // 3. The "Smooth Operator": Updates everyone every frame for a set duration
  // Call this when you toggle a button that causes an animation
  animateLayoutChanges(durationMs: number = 600) {
    // Cancel any existing loop to prevent clashes
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const startTime = performance.now();

    // Run outside Angular to avoid triggering Change Detection 60 times a second
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