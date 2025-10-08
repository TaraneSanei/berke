import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of, tap } from 'rxjs';
import { Course, Emotion, Journal } from '../../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl
  private cache = new Map<string, Course>();

  getSessions(url: string | null): Observable<any> {
    if (url) {
      return this.http.get<any>(url);
    }
    return this.http.get<any>(this.apiUrl + 'sessions/journeys/');
  }


  getCourse(courseId: string): Observable<Course> {
    if (this.cache.has(courseId)) {
      return of(this.cache.get(courseId)!);
    }
    return this.http.get<Course>(this.apiUrl + '/meditation/courses/' + courseId).pipe(
      tap(course => {
        this.cache.set(courseId, course)
        console.log(this.cache)
      })
    );
  }

  loadJournals(date: string) {
    return this.http.get<Journal[]>(this.apiUrl + 'journal?date=' + date);
  }

  getEmotions() {
    return this.http.get<Emotion[]>(this.apiUrl + 'journal/emotions');
  }

  addJournal(journal: Journal) {
    return this.http.post<Journal>(this.apiUrl + 'journal/new/', journal);
  }
}

