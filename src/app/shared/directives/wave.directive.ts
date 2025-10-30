import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, HostListener } from '@angular/core';

interface Wave {
  wavelength: number;
  amplitude: number;
  speed: number;
  phase: number;
  targetAmplitude: number;
  targetWavelength: number;
  targetSpeed: number;
  initialAmplitude?: number;
  initialWavelength?: number;
  initialSpeed?: number;
}

@Directive({
  selector: '[appWave]'
})
export class WaveDirective implements OnInit, OnDestroy {

  @Input() syncLevel = 0; // 0 = chaotic, 1 = fully harmonized
  @Input() duration?: number; // optional: duration in ms for gradual harmony

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;
  private animationFrameId: number | null = null;
  private waves: Wave[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.createCanvas();
    this.initWaves();
    this.resizeCanvas();

    // Animate dynamic harmony if duration is provided
    if (this.duration) this.animateHarmonyOverTime();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
  }

  private createCanvas(): void {
    this.canvas = this.renderer.createElement('canvas');
    this.renderer.appendChild(this.el.nativeElement, this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '0';
  }

  private initWaves() {
    // Define the 3 waves with disorganized initial values and harmonious target values
    this.waves = [
      { wavelength: 30, amplitude: 15, speed: 0.03, phase: 0, targetAmplitude: 12, targetWavelength: 35, targetSpeed: 0.02 },
      { wavelength: 48, amplitude: 12, speed: 0.010, phase: 2, targetAmplitude: 12, targetWavelength: 35, targetSpeed: 0.025 },
      { wavelength: 23, amplitude: 10, speed: 0.025, phase: 4, targetAmplitude: 12, targetWavelength: 35, targetSpeed: 0.015 },
    ];

    // If no duration, compute static harmony immediately
    if (!this.duration) {
      this.waves.forEach(w => {
        w.amplitude = this.lerp(w.amplitude, w.targetAmplitude, this.syncLevel);
        w.wavelength = this.lerp(w.wavelength, w.targetWavelength, this.syncLevel);
        w.speed = this.lerp(w.speed, w.targetSpeed, this.syncLevel);
      });
    }
  }

  private resizeCanvas(): void {
    const parent: HTMLElement = this.el.nativeElement;
    const dpr = window.devicePixelRatio || 1;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    if (this.ctx) {
      this.ctx.resetTransform?.();
      this.ctx.scale(dpr, dpr);
    }

    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    this.animate(width, height);
  }

  private animateHarmonyOverTime() {
    if (!this.duration) return;

    // Store initial values to interpolate from
    this.waves.forEach(w => {
      w.initialAmplitude = w.amplitude;
      w.initialWavelength = w.wavelength;
      w.initialSpeed = w.speed;
    });

    const start = performance.now();
    const step = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / this.duration!, 1);

      // Linear interpolation for uniform change
      this.waves.forEach(w => {
        w.amplitude = w.initialAmplitude! + (w.targetAmplitude - w.initialAmplitude!) * progress;
        w.wavelength = w.initialWavelength! + (w.targetWavelength - w.initialWavelength!) * progress;
        w.speed = w.initialSpeed! + (w.targetSpeed - w.initialSpeed!) * progress;
      });

      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  private animate = (width: number, height: number) => {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, width, height);

    // Only interpolate dynamically if duration is defined
    if (this.duration) this.updateWavesPhase();

    for (let wave of this.waves) {
      wave.phase += wave.speed;
      this.drawWave(width, height, wave);
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate(width, height));
  }

  private updateWavesPhase() {
    // This can be left empty for now, as phase is updated in animate()
  }

  private drawWave(width: number, height: number, wave: Wave) {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.moveTo(0, height);
    this.ctx.lineTo(0, height / 2);
    for (let x = 0; x < width; x++) {
      const y = height / 2 + Math.sin(x / wave.wavelength + wave.phase) * wave.amplitude;
      this.ctx.lineTo(x, y);
    }

    this.ctx.lineTo(width, height);
    this.ctx.closePath();

    const waveGradient = this.ctx.createLinearGradient(0, height / 2, 0, height);
    waveGradient.addColorStop(0, 'rgba(255,255,255, 0.15)');
    waveGradient.addColorStop(1, 'rgba(255,255,255, 0)');
    this.ctx.fillStyle = waveGradient;
    this.ctx.fill();
  }

  private lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }
}
