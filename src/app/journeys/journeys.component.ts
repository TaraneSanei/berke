import { Component, HostListener, effect, signal } from '@angular/core';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import { LoadJourneysSessions } from '../state/JourneysSessions/journeysSessions.actions';
import { selectJourneysSessions, selectNext, selectPrevious } from '../state/JourneysSessions/journeysSessions.selector';
import { Course, Journey, JourneysSession, Track } from '../models/data.models';
import { CommonModule } from '@angular/common';
import { WindowDirective } from '../shared/directives/window.directive';
import { DataService } from '../shared/services/data.service';
import { forkJoin } from 'rxjs';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe'
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { WaveDirective } from "../shared/directives/wave.directive";
import { Button } from "primeng/button";
import { Router } from '@angular/router';

@Component({
  selector: 'app-journeys',
  imports: [CommonModule,
    WindowDirective,
    PersianDigitsPipe,
    DividerModule,
    AccordionModule, Button],
  templateUrl: './journeys.component.html',
  styleUrl: './journeys.component.css'
})
export class JourneysComponent {

  previous: any;
  next: any;
  sessions = signal<JourneysSession[]>([])
  journeys: Journey[] = []
  expanded = signal<number | null>(null)

  constructor(private store: Store<AppState>, private dataservice: DataService, private router: Router) {

    this.next = this.store.selectSignal(selectNext);
    this.previous = this.store.selectSignal(selectPrevious);

    effect(() => {
      this.store.dispatch(LoadJourneysSessions({ url: null }));
    })

    effect(() => {
      const sessionsData = this.store.selectSignal(selectJourneysSessions)
      this.sessions.set(sessionsData())
      this.orderSessions()
      console.log(this.journeys)
    })
  }

  toggleExpanded(journey: Journey) {
    if (this.expanded() !== journey.course.id) {
      this.expanded.set(journey.course.id)
    } else {
      this.expanded.set(null)
    }
    console.log(this.expanded())
  }

  loadMoreSessions() {
    let nextUrl: string | null = this.next()
    if (nextUrl != null) {
      this.store.dispatch(LoadJourneysSessions({ url: nextUrl }))
    }
  }

  @HostListener("window:scroll", [])
  onScroll(event: any) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
      this.loadMoreSessions();
    }
  }

  orderSessions() {
    const sessions = this.sessions();
    if (!sessions || sessions.length === 0) {
      return;
    }

    const uniqueIds = [...new Set(sessions.map(s => s.courseId.toString()))];
    forkJoin(
      uniqueIds.map(id => this.dataservice.getCourse(id))
    ).subscribe(courses => {
      this.journeys = courses.map(course => {
        const listened = sessions
          .filter(s => s.courseId === course.id)
          .map(s => s.trackId);
        return { course, listenedto: listened };
      });
    });
  }

  getNextTrackId(journey: Journey): number | null {
    if (!journey.course?.tracks || !journey.listenedto) return null;
    const sortedTracks = [...journey.course.tracks].sort((a, b) => a.dayNumber - b.dayNumber);

    const nextTrack = sortedTracks.find(track => !journey.listenedto.includes(track.id));
    return nextTrack ? nextTrack.id : null;
  }
  playTrack(track: Track) {
    this.router.navigate(['/play', track.id]);
  }
}
