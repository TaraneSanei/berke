import { HttpInterceptorFn } from '@angular/common/http';
import { BerkeService } from '../berke.service';
import { inject } from '@angular/core';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const berkeService = inject(BerkeService);

  const tracksApiPattern = /\/meditation\/tracks\/(\d+)/;
  const match = req.url.match(tracksApiPattern);
  if(match){
    const courseId = Number(match[1]);
    const lastModified = berkeService.getLastModified(courseId);
    if (lastModified) {
      req = req.clone({
        setHeaders: {
          'If-Modified-Since': lastModified
        }
      });
    }
  }

  else if(req.url.includes('/meditation/courses')){
    const coursesLastModified = localStorage.getItem('coursesLastModified')
    if (coursesLastModified) {
      req = req.clone({
        setHeaders: {
          ...req.headers.keys().reduce((acc, key) => ({ ...acc, [key]: req.headers.get(key) ?? '' }), {}),
          'If-Modified-Since': coursesLastModified
        }
      });
    }
  } else if(req.url.includes('meditation/tags')) {
    const tagsLastModified = localStorage.getItem('tagsLastModified');
    if (tagsLastModified) {
      req = req.clone({
        setHeaders: {
          ...req.headers.keys().reduce((acc, key) => ({ ...acc, [key]: req.headers.get(key) ?? '' }), {}),
          'If-Modified-Since': tagsLastModified
        }
      });
    }
  }

  return next(req);
};
