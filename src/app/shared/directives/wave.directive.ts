
import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, HostListener, OnChanges, SimpleChanges, AfterViewInit, inject } from '@angular/core';
import { CutoutService } from '../services/cutout.service';

interface Wave {
  wavelength: number;
  amplitude: number;
  speed: number;
  phase: number;
  targetAmplitude: number;
  targetWavelength: number;
  targetSpeed: number;
  initialAmplitude: number;
  initialWavelength: number;
  initialSpeed: number;
}

@Directive({
  selector: '[appWave]'
})
export class WaveDirective implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  private cutoutService = inject(CutoutService);
  @Input() syncLevel = 0; 
  private renderedSyncLevel: number = 0;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;
  private animationFrameId: number | null = null;
  private waves: Wave[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  ngAfterViewInit() {
    this.cutoutService.register(() => this.resizeCanvas());
  }

  ngOnInit(): void {
    this.createCanvas();
    this.initWaves();
    this.resizeCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
  }

  // 2. Handle Input Changes
ngOnChanges(changes: SimpleChanges): void {
    if (changes['syncLevel']) {
      if (!this.animationFrameId) {
        const parent: HTMLElement = this.el.nativeElement;
        this.animate(parent.clientWidth, parent.clientHeight);
      }
    }
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
    this.waves = [
      { wavelength: 30, amplitude: 15, speed: 0.03, phase: 0, 
        targetAmplitude: 12, targetWavelength: 35, targetSpeed: 0.02, 
        initialAmplitude: 15, initialWavelength: 30, initialSpeed: 0.03 },
      { wavelength: 48, amplitude: 12, speed: 0.010, phase: 2, 
        targetAmplitude: 12, targetWavelength: 35, targetSpeed: 0.025, 
        initialAmplitude: 12, initialWavelength: 48, initialSpeed: 0.010 },
      { wavelength: 23, amplitude: 10, speed: 0.025, phase: 4, 
        targetAmplitude: 12, targetWavelength: 35, targetSpeed: 0.015, 
        initialAmplitude: 10, initialWavelength: 23, initialSpeed: 0.025 },
    ];
    
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
  
private updateWaveProperties(t: number) {
    this.waves.forEach(w => {
      w.amplitude = this.lerp(w.initialAmplitude, w.targetAmplitude, t);
      w.wavelength = this.lerp(w.initialWavelength, w.targetWavelength, t);
      w.speed = this.lerp(w.initialSpeed, w.targetSpeed, t);
    });
  }

private animate = (width: number, height: number) => {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, width, height);
    
    const diff = this.syncLevel - this.renderedSyncLevel;
    this.renderedSyncLevel += diff * 0.05;
    this.updateWaveProperties(this.renderedSyncLevel);

    for (let wave of this.waves) {
      wave.phase += wave.speed;
      this.drawWave(width, height, wave);
    }
    this.animationFrameId = requestAnimationFrame(() => this.animate(width, height));
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
