import { Injectable, signal } from '@angular/core';
import { usePreset } from '@primeng/themes';
import { aurora, morning, forest, mountain, sunrise, sunset } from '../../../mypresets';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Course, Tag } from '../../models/data.models';
import { catchError, EMPTY, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BerkeService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl + 'meditation/'
  private _courses = signal<Course[]>([]);
  public courses = this._courses.asReadonly();
  private _errorMessage = signal<string | null>(null);
  public errorMessage = this._errorMessage.asReadonly();
  private _tags = signal<Tag[]>([]);
  public tags = this._tags.asReadonly();

  //setters and getters for the cached last modified token for courses and tags list

  getCoursesLastModified(): string | null {
    return localStorage.getItem('coursesLastModified');
  }

  setCoursesLastModified(value: string) {
    localStorage.setItem('coursesLastModified', value);
  }

  getTagsLastModified(): string | null {
    return localStorage.getItem('tagsLastModified');
  }

  setTagsLastModified(value: string) {
    localStorage.setItem('tagsLastModified', value);
  }


  //setters and getters for the cached data of courses and tags list

  setTags(tags: any) {
    localStorage.setItem('tags', JSON.stringify(tags));
  }

  
  getTags(): Tag[] | null {
    const tags = localStorage.getItem('tags');
    if (tags) {
      return JSON.parse(tags)
    } else {
      return null
    }
  }

  setCourses(courses: any) {
    localStorage.setItem('courses', JSON.stringify(courses));
  }

  getCourses(): Course[] | null {
    const courses = localStorage.getItem('courses');
    if (courses) {
      return JSON.parse(courses)
    } else {
      return null
    }
  }


  //methods to load the courses list and the tags list from the backend and update the cache

  loadCourses() {
    this.http.get<Course[]>(this.apiUrl + 'courses', { observe: 'response' })
      .pipe(
        tap(response => {
          if (response.status === 200 && response.body) {
            const courses_data = response.body
            this.setCourses(courses_data)
            this._courses.set(courses_data || []);
            const lm = response.headers.get('Last-Modified');
            if (lm) this.setCoursesLastModified(lm);
            this._errorMessage.set(null);
          }

        }),
        catchError(err => {
          if (err.status === 304) {
            console.log('err 304')
            const cached = this.getCourses();
            if (cached) {
              this._courses.set(cached);
              this._errorMessage.set(null);
              console.log('Using cached courses data', cached);
            }
            return EMPTY;
          }

          this._errorMessage.set(this.getErrorMessage(err));
          console.log('Error loading courses:', this._errorMessage());
          return EMPTY;
        })
      )
      .subscribe();
  }

  
  loadTags() {
    this.http.get<Tag[]>(this.apiUrl + 'tags', { observe: 'response' })
      .pipe(
        tap(response => {
          if (response.status === 200 && response.body) {
            const tags_data = response.body
            this.setTags(tags_data)
            this._tags.set(tags_data || []);
            const lm = response.headers.get('Last-Modified');
            if (lm) this.setTagsLastModified(lm);
            this._errorMessage.set(null);
          }
        }),
        catchError(err => {
          if (err.status === 304) {
            console.log('e4r 304')
            const cached = this.getTags();
            if (cached) {
              this._tags.set(cached);
              this._errorMessage.set(null);
              console.log('Using cached tags data', cached);
            }
            return EMPTY;
          }

          this._errorMessage.set(this.getErrorMessage(err));
          console.log('Error loading tags:', this._errorMessage());
          return EMPTY;
        })
      )
      .subscribe();
  }


  //setters and getters for the cached data of each course based on ID

  getLastModified(courseId: number): string | null {
    return localStorage.getItem(`tracksLastModified_${courseId}`);
  }

  setLastModified(courseId: number, value: string) {
    localStorage.setItem(`tracksLastModified_${courseId}`, value);
  }


  //in app helper methods
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
