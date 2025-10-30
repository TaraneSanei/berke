import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, of, tap } from 'rxjs';
import { CalendarSummary, Course, Emotion, Journal, MeditationSession } from '../../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl
  private cache = new Map<string, Course>();

  getCoursesCache(): Map<string, Course> {
  return this.cache;
}
  getJourneysSessions(url: string | null): Observable<any> {
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

  loadMeditationSessions(date: any): Observable<any> {
    return this.http.get<MeditationSession[]>(this.apiUrl + 'sessions/sessions?date=' + date )
  }

  getMonthSummary(startDate: string, endDate: string) : Observable<CalendarSummary[]> {
  return this.http.get<CalendarSummary[]>(this.apiUrl + 'dashboard/calendar/summary?startDate=' + startDate + '&endDate=' + endDate)
}


  getEmotions() {
    return this.http.get<Emotion[]>(this.apiUrl + 'journal/emotions');
  }

  addJournal(journal: Journal) {
    return this.http.post<Journal>(this.apiUrl + 'journal/new/', journal);
  }

  editJournal(journal: Journal) {
    return this.http.put<Journal>(this.apiUrl + 'journal/' + journal.id, journal);
  }

  deleteJournal(journal: Journal) {
    return this.http.delete<Journal>(this.apiUrl + 'journal/' + journal.id);
  }
}

