
import { Injectable, signal, inject, computed, effect } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { usePreset } from '@primeng/themes';
import { aurora, morning, forest, mountain, sunrise, sunset, neutral } from '../../../mypresets';
import { environment } from '../../../environments/environment';
import { Course, Emotion, Tag } from '../../models/data.models';
import { catchError, EMPTY, tap } from 'rxjs';
import * as jalali from 'jalaali-js';
import localforage from 'localforage';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { selectUserError } from '../../state/user/user.selector';
import { selectJournalError } from '../../state/journal/journal.selector';
import { selectCalendarError } from '../../state/history/history.selector';
import { selectJourneysError } from '../../state/journeys/journeys.selector';
import { selectMeditationSessionsError } from '../../state/meditationsSessions/meditationSessions.selector';

@Injectable({
  providedIn: 'root'
})
export class BerkeService {
  
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private store = inject(Store<AppState>);
  private _courses = signal<Course[]>([]);
  public courses = this._courses.asReadonly();

  private _tags = signal<Tag[]>([]);
  public tags = this._tags.asReadonly();

private _userTheme = signal<string>('sunrise'); // Default to sunrise immediately
  public userTheme = this._userTheme.asReadonly();

  private _emotions = signal<Emotion[]>([]);
  public emotions = this._emotions.asReadonly();

  private _recommendationMap = signal<Record<string, number[]>>({});
  public recommendationMap = this._recommendationMap.asReadonly();

  private _errorMessage = signal<string | null>(null);
  public errorMessage = this._errorMessage.asReadonly();

  private metaStore = localforage.createInstance({
    name: "Berke_App",
    storeName: "metadata"
  });
// global error handling
  private userError = this.store.selectSignal(selectUserError)
  private journalError = this.store.selectSignal(selectJournalError)
  private historyError = this.store.selectSignal(selectCalendarError)
  private journeysError = this.store.selectSignal(selectJourneysError)
  private meditationSessionsError = this.store.selectSignal(selectMeditationSessionsError)

  public activeError = computed(() =>{
    const rawError = this.userError() ||
     this.journalError() || 
     this.historyError() || 
     this.journeysError() || 
     this.meditationSessionsError() ||
     this._errorMessage() ||
     null
     if (!rawError) return null;
     return this.getErrorMessage(rawError);
  })
  
  constructor() {


    effect(() => {
      console.log('User theme changed:', this.userTheme());
    })
  }

  async loadCourses() {
    const cached = await this.metaStore.getItem<Course[]>('courses');
    const lastModified = await this.metaStore.getItem<string>('courses_lm');
    
    if (cached) this._courses.set(cached);

    const headers = lastModified ? new HttpHeaders().set('If-Modified-Since', lastModified) : undefined;

    this.http.get<Course[]>(`${this.apiUrl}meditation/courses`, { observe: 'response', headers })
      .pipe(
        tap(async res => {
          if (res.status === 200 && res.body) {
            this._courses.set(res.body);
            await this.metaStore.setItem('courses', res.body);
            const lm = res.headers.get('Last-Modified');
            if (lm) await this.metaStore.setItem('courses_lm', lm);
          }
        }),
        catchError(err => this.handleError(err, 'courses'))
      ).subscribe();
  }

  async loadTags() {
    const cached = await this.metaStore.getItem<Tag[]>('tags');
    const lastModified = await this.metaStore.getItem<string>('tags_lm');

    if (cached) this._tags.set(cached);

    const headers = lastModified ? new HttpHeaders().set('If-Modified-Since', lastModified) : undefined;

    this.http.get<Tag[]>(`${this.apiUrl}meditation/tags`, { observe: 'response', headers })
      .pipe(
        tap(async res => {
          if (res.status === 200 && res.body) {
            this._tags.set(res.body);
            await this.metaStore.setItem('tags', res.body);
            const lm = res.headers.get('Last-Modified');
            if (lm) await this.metaStore.setItem('tags_lm', lm);
          }
        }),
        catchError(err => this.handleError(err, 'tags'))
      ).subscribe();
  }

  async loadEmotions() {
    const cached = await this.metaStore.getItem<Emotion[]>('emotions');
    const lastModified = await this.metaStore.getItem<string>('emotions_lm');

    if (cached) this._emotions.set(cached);

    const headers = lastModified ? new HttpHeaders().set('If-Modified-Since', lastModified) : undefined;

    this.http.get<Emotion[]>(`${this.apiUrl}journal/emotions`, { observe: 'response', headers })
      .pipe(
        tap(async res => {
          if (res.status === 200 && res.body) {
            this._emotions.set(res.body);
            await this.metaStore.setItem('emotions', res.body);
            const lm = res.headers.get('Last-Modified');
            if (lm) await this.metaStore.setItem('emotions_lm', lm);
          }
        }),
        catchError(err => this.handleError(err, 'emotions'))
      ).subscribe();
  }

  async loadRecommendationMap() {
    const cached = await this.metaStore.getItem<Record<string, number[]>>('recommendation_map');
    if (cached) this._recommendationMap.set(cached);

    this.http.get<Record<string, number[]>>(`${this.apiUrl}meditation/recommendation`, { observe: 'response' })
      .pipe(
        tap(async res => {
          if (res.status === 200 && res.body) {
            this._recommendationMap.set(res.body);
            await this.metaStore.setItem('recommendation_map', res.body);
          }
        }),
        catchError(err => {
          this._errorMessage.set(this.getErrorMessage(err));
          return EMPTY;
        })
      ).subscribe();
  }

  private handleError(err: any, type: string) {
    if (err.status === 304) {
      console.log(`${type} not modified, using cache.`);
      return EMPTY;
    }
    this._errorMessage.set(this.getErrorMessage(err));
    return EMPTY;
  }

  // Theme Logic

async initializeAppTheme(): Promise<void> {
    const savedTheme = await this.metaStore.getItem<string>('user-theme');
        const themeToApply = savedTheme || 'sunrise';
        await this.setTheme(themeToApply as any);
  }

async setTheme(theme: 'sunrise' | 'sunset' | 'forest' | 'aurora' | 'mountain' | 'morning' | 'neutral') {
    const presets: any = { forest, aurora, mountain, morning, sunset, sunrise, neutral };
    const preset = presets[theme] || sunrise;
    
    usePreset(preset);
    this._userTheme.set(theme);
    await this.metaStore.setItem('user-theme', theme);
  }

  // --- Utility Methods ---
  
  ERROR_MESSAGES: Record<string, string> = {
    "user with this phone number already exists.": "کاربری با این شماره قبلاً ثبت شده است.",
    "No active account found with the given credentials": "شماره تماس یا گذرواژه اشتباه است.",
    "token_not_valid": "دسترسی شما منقضی شده است.",
    "Network Error": "خطای شبکه. لطفاً اتصال اینترنت را بررسی کنید.",
  };

  getErrorMessage(error: any): string {
    const raw = error?.detail || error?.message || error?.error?.code || error?.toString();
if (this.ERROR_MESSAGES[raw]) {
    return this.ERROR_MESSAGES[raw];
  }

  // DEVELOPMENT/BETA MODE: 
  // Show the raw error so we can screenshot it
  console.error("Untranslated Error:", raw);
  return `خطای ناشناخته: ${raw}`;
  }

  toEnglishDigits(input: string): string {
    const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return input.replace(/[۰-۹]/g, d => persianDigits.indexOf(d).toString());
  }

  getGregorianDateRange(jy: number, jm: number): { startDate: string, endDate: string } {
    const gStart = jalali.toGregorian(jy, jm, 1);
    const startDate = new Date(gStart.gy, gStart.gm - 1, gStart.gd);
    let nextJm = jm + 1;
    let nextJy = jy;
    if (nextJm > 12) { nextJm = 1; nextJy++; }
    const gEnd = jalali.toGregorian(nextJy, nextJm, 1);
    const endDate = new Date(gEnd.gy, gEnd.gm - 1, gEnd.gd);

    const format = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return { startDate: format(startDate), endDate: format(endDate) };
  }
}