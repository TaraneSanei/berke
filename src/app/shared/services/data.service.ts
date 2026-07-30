import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, concat, EMPTY, forkJoin, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { CalendarSummary, Course, Emotion, Journal, Journey, JourneysSession, MeditationSession, Order, Track } from '../../models/data.models';
import localforage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }
  private readonly COURSE_CACHE_KEY_PREFIX = 'course_details_';
  private apiUrl = environment.apiUrl
  private cache = new Map<string, Course>();

private courseKeys(courseId: string) {
  const body = this.COURSE_CACHE_KEY_PREFIX + courseId;
  return { body, lm: `${body}_lm` };
}

  getCoursesCache(): Map<string, Course> {
    return this.cache;
  }
  getJourneysSessions(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'sessions/journeys/');
  }

  getOrderHistory(){
    return this.http.get<Order[]>(this.apiUrl + 'subscription/orders');
  }


  getCourse(courseId: string): Observable<Course> {
  const { body: bodyKey, lm: lmKey } = this.courseKeys(courseId);
  const memCached = this.cache.get(courseId) ?? null;

  const read$ = from(Promise.all([
    memCached ? Promise.resolve(memCached) : localforage.getItem<Course>(bodyKey),
    localforage.getItem<string>(lmKey),
  ]));

  return read$.pipe(
    switchMap(([cached, lastModified]) => {
      if (cached) this.cache.set(courseId, cached);

      // only revalidate when BOTH the body and its timestamp survived
      const headers = (cached && lastModified)
        ? new HttpHeaders().set('If-Modified-Since', lastModified)
        : undefined;

      const fresh$ = this.http
        .get<Course>(`${this.apiUrl}meditation/courses/${courseId}`, {
          observe: 'response',
          headers,
        })
        .pipe(
          switchMap(res => {
            if (res.status === 200 && res.body) {
              const course = res.body;
              this.cache.set(courseId, course);
              return from(this.cacheCourse(course, res.headers.get('Last-Modified')))
                .pipe(map(() => course));
            }
            return cached ? of(cached) : EMPTY;
          }),
          catchError(err => {
            if (err?.status === 304) {
              return EMPTY; 
            }
            console.error(`Error fetching course ${courseId}:`, err);
            return cached ? EMPTY : throwError(() => err);
          })
        );

      return cached ? concat(of(cached), fresh$) : fresh$;
    })
  );
}

private async cacheCourse(course: Course, lastModified: string | null): Promise<void> {
  const { body: bodyKey, lm: lmKey } = this.courseKeys(String(course.id));
  try {
    await localforage.setItem(bodyKey, course);
    if (lastModified) {
      await localforage.setItem(lmKey, lastModified);
    } else {
      await localforage.removeItem(lmKey); // don't keep a stale timestamp
    }
  } catch (err) {
    console.error(`Error saving course ${course.id} to localforage:`, err);
  }
}


  // getCourse(courseId: string): Observable<Course> {
  //   if (this.cache.has(courseId)) {
  //     return of(this.cache.get(courseId)!);
  //   }
  //   const cacheKey = this.COURSE_CACHE_KEY_PREFIX + courseId;
  //   return from(localforage.getItem<Course>(cacheKey)).pipe(
  //     switchMap(cachedCourse => {
  //       if (cachedCourse) {
  //         console.log(`[Cache] Found course ${courseId} in IndexedDB.`);
  //         this.cache.set(courseId, cachedCourse);
  //         return of(cachedCourse);
  //       }
  //       console.log(`[Cache] Course ${courseId} not found. Fetching from API.`);
  //       return this.http.get<Course>(this.apiUrl + 'meditation/courses/' + courseId).pipe(
  //         tap(course => {
  //           this.cache.set(courseId, course)
  //         }), tap(course => {
  //           this.cacheCourse(course);
  //         }),
  //         catchError(err => {
  //           console.error(`Error fetching or caching course ${courseId}:`, err);
  //           return EMPTY;
  //         })
  //       );
  //     })
  //   )
  // }

  // private async cacheCourse(course: Course): Promise<void> {
  //   const cacheKey = this.COURSE_CACHE_KEY_PREFIX + course.id;
  //   try {
  //     await localforage.setItem(cacheKey, course);
  //     console.log(`[Cache] Saved course ${course.id} to IndexedDB.`);
  //   } catch (err) {
  //     console.error(`Error saving course ${course.id} to localforage:`, err);
  //   }
  // }

  getTrack(trackId: number): Observable<Track> {
    for (const course of this.getCoursesCache().values()) {
      const found = course.tracks.find(t => t.id === trackId);
      console.log('Found track:', found);
      if (found) return of(found);
    }
    return this.http.get<Track>(this.apiUrl + 'meditation/track/' + trackId)
  }

  getTrackUrl(trackId: number){
    return this.http.get<{ audio_url: string }>(this.apiUrl + 'meditation/tracks/' + trackId + '/audio-url/')
  }
  
  makeJourneys(
    sessions: JourneysSession[],
  ): Observable<Journey[]> {
    const uniqueCourseIds = Array.from(new Set(sessions.map(s => s.courseId)));
    const sessionsByCourse = new Map<number, JourneysSession[]>();
    sessions.forEach(session => {
      if (!sessionsByCourse.has(session.courseId)) {
        sessionsByCourse.set(session.courseId, []);
      }
      sessionsByCourse.get(session.courseId)!.push(session);
    });

    const courseLookupObservables: { [key: number]: Observable<Course> } = {};
    uniqueCourseIds.forEach(courseId => {
      courseLookupObservables[courseId] = this.getCourse(courseId.toString());
    });

    return forkJoin(courseLookupObservables).pipe(
      map(courseDetailsMap => {
        let journeys: Journey[] = [];
        let latestSessionTime = 0;
        sessionsByCourse.forEach((rawSessions, courseId) => {
          const course = courseDetailsMap[courseId];
          if (course) {
            const listenedto = Array.from(new Set(rawSessions.map(s => s.trackId)));
            const latestSessionId = rawSessions.reduce((maxId, session) => Math.max(maxId, session.id!), 0);

            journeys.push({
              course: course,
              listenedto: listenedto,
              latestSessionId: latestSessionId,
            });
          }
        });

        journeys.sort((a, b) => b.latestSessionId! - a.latestSessionId!);

        return journeys;
      })
    )
  }

  loadJournals(date: string) {
    return this.http.get<Journal[]>(this.apiUrl + 'journal?date=' + date);
  }

  loadMeditationSessions(date: any): Observable<any> {
    return this.http.get<MeditationSession[]>(this.apiUrl + 'sessions/sessions?date=' + date)
  }

  addMeditationSession(session: MeditationSession): Observable<MeditationSession> {
    return this.http.post<MeditationSession>(this.apiUrl + 'sessions/sessions/new/', session)
  }

  updateMeditationSession(session: MeditationSession): Observable<MeditationSession> {
    return this.http.put<MeditationSession>(this.apiUrl + 'sessions/session/' + session.id + '/', session)
  }

  getMonthSummary(startDate: string, endDate: string): Observable<CalendarSummary[]> {
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

