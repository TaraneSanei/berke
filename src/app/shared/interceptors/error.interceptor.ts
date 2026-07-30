import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

const errorTranslations: Record<string, string> = {
  "Track not found": "فایل صوتی پیدا نشد.",
  "user doesn't have access": "شما اشتراک فعال برای دسترسی به این محتوا را ندارید.",
  "Given token not valid for any token type": "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
  "Token is invalid or expired": "کد تایید نامعتبر یا منقضی شده است.",
  "No active account found with the given credentials": "حساب کاربری با این مشخصات یافت نشد.",
  "Not found.": "اطلاعات درخواست شده یافت نشد.",
  "User not found": "کاربری با این شماره یافت نشد.",
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 304) {
        return throwError(() => error);
      }
      if (error.status === 200 && error.message.includes('JSON')) {
          return throwError(() => error);
      }
      let errorMessage = 'خطای نامشخصی رخ داده است. لطفاً دوباره تلاش کنید.';

      if (error.error instanceof ErrorEvent || error.status === 0) {
        errorMessage = 'خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.';
      } 
      else {
        const backendErrorString = error.error?.error || error.error?.detail;
        if (error.status === 401) {
            if (req.url.includes('token/refresh')) {
              return throwError(() => error);
            } else {
                errorMessage = errorTranslations[backendErrorString] || 'اطلاعات وارد شده نامعتبر است.';
            }
        }
        if (backendErrorString && typeof backendErrorString === 'string') {
           errorMessage = errorTranslations[backendErrorString] || 'خطایی در سیستم رخ داده است.';
          
          
        } else {
          if (error.status === 500) errorMessage = 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.';
          if (error.status === 404) errorMessage = 'محتوای مورد نظر یافت نشد.';
          if (error.status === 403) errorMessage = 'شما دسترسی لازم برای این کار را ندارید.';
        }
      }
      if (error.status === 401) {
  const isRefreshCall = req.url.includes('token/');
  if (!isRefreshCall) {
    return throwError(() => error);
  }
}

      messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: errorMessage,
        life: 4000
      });

      return throwError(() => error);
    })
  );
};