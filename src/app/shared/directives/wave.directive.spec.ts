import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WaveDirective } from './wave.directive';
import { CutoutService } from '../services/cutout.service';

describe('WaveDirective', () => {
  let host: HTMLElement;
  let renderer: jasmine.SpyObj<Renderer2>;
  let cutout: { register: jasmine.Spy };

  beforeEach(() => {
    host = document.createElement('div');
    cutout = { register: jasmine.createSpy('register') };

    renderer = jasmine.createSpyObj<Renderer2>('Renderer2', [
      'createElement',
      'appendChild',
    ]);
    renderer.createElement.and.callFake(
      (name: string) => document.createElement(name)
    );

    TestBed.configureTestingModule({
      providers: [{ provide: CutoutService, useValue: cutout }],
    });
  });

  function create(): WaveDirective {
    return TestBed.runInInjectionContext(
      () => new WaveDirective(new ElementRef(host), renderer)
    );
  }

  it('should create an instance', () => {
    expect(create()).toBeTruthy();
  });

  it('registers a resize callback with CutoutService on ngAfterViewInit', () => {
    const directive = create();
    directive.ngAfterViewInit();
    expect(cutout.register).toHaveBeenCalledTimes(1);
  });
});
