import { Injectable } from '@angular/core';
import { usePreset } from '@primeng/themes';
import { aurora, morning, forest, mountain, sunrise, sunset } from '../mypresets';

@Injectable({
  providedIn: 'root'
})
export class BerkeService {

  constructor() { }

  
  setTheme(theme: 'sunrise' | 'sunset' | 'forest' | 'aurora' | 'mountain' | 'morning') {
    if (theme === 'forest') {
      const preset = forest;
      usePreset(preset);
      localStorage.setItem('user-theme', 'forest');
    } else if (theme === 'aurora') {
      const preset = aurora;
      usePreset(preset);
      localStorage.setItem('user-theme', 'aurora');
    }
    else if (theme === 'mountain') {
      const preset = mountain;
      usePreset(preset);
      localStorage.setItem('user-theme', 'mountain');
    }
    else if (theme === 'morning') {
      const preset = morning;
      usePreset(preset);
      localStorage.setItem('user-theme', 'morning');
    }
    else if (theme === 'sunset') {
      const preset = sunset;
      usePreset(preset);
      localStorage.setItem('user-theme', 'sunset');
    } else {
      const preset = sunrise;
      usePreset(preset);
      localStorage.setItem('user-theme', 'sunrise');
    }

  }

  ERROR_MESSAGES: Record<string, string> = {
    "user with this phone number already exists.": "کاربری با این شماره قبلاً ثبت شده است.",
    "No active account found with the given credentials": "شماره تماس یا گذرواژه اشتباه است.",
    "Token is invalid": "توکن نامعتبر است.",
    "Given token not valid for any token type": "توکن ارسال‌شده معتبر نیست.",
    "token_not_valid": "دسترسی شما منقضی شده است.",
    "Network Error": "خطای شبکه. لطفاً اتصال اینترنت را بررسی کنید.",
  };

  getErrorMessage(error: any): string {
    const raw =
      error?.detail ||
      error?.message ||
      error?.error?.code ||
      error?.message ||
      error?.toString();

    return this.ERROR_MESSAGES[raw] || "خطای ناشناخته‌ای رخ داده است.";
  }

  toEnglishDigits(input: string): string {
  const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return input.replace(/[۰-۹]/g, d => persianDigits.indexOf(d).toString());
}
}
