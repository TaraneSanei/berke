import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SafeHtmlPipe(sanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('delegates to bypassSecurityTrustHtml', () => {
    const spy = spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    pipe.transform('<b>سلام</b>');
    expect(spy).toHaveBeenCalledWith('<b>سلام</b>');
  });
});
