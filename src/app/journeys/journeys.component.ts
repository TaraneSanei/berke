import { Component, HostListener, effect, inject, signal } from '@angular/core';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import { LoadJourneys } from '../state/journeys/journeys.actions';
import { selectJourneys } from '../state/journeys/journeys.selector';
import { Course, Journey, JourneysSession, Track } from '../models/data.models';
import { CommonModule } from '@angular/common';
import { WindowDirective } from '../shared/directives/window.directive';
import { DataService } from '../shared/services/data.service';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe'
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { WaveDirective } from "../shared/directives/wave.directive";
import { Router } from '@angular/router';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-journeys',
  imports: [CommonModule,
    WindowDirective,
    PersianDigitsPipe,
    DividerModule,
    AccordionModule,
    WaveDirective,
    ButtonModule,
    SafeHtmlPipe
  ],
  templateUrl: './journeys.component.html',
  styleUrl: './journeys.component.css'
})
export class JourneysComponent {

  private router = inject(Router);
  journeys = signal<Journey[]>([])
  expanded = signal<number | null>(null)

  constructor(private store: Store<AppState>, private dataservice: DataService) {

    effect(() => {
      this.store.dispatch(LoadJourneys());
    })

    effect(() => {
      const journeysData = this.store.selectSignal(selectJourneys)
      this.journeys.set(journeysData())
      // this.orderSessions()
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

  calculateSyncLevel(journey: Journey) {
    return journey.listenedto.length / journey.course.tracks.length;
  }

  // orderSessions() {
  //   const sessions = this.sessions();
  //   if (!sessions || sessions.length === 0) {
  //     return;
  //   }

  //   const uniqueIds = [...new Set(sessions.map(s => s.courseId.toString()))];
  //   forkJoin(
  //     uniqueIds.map(id => this.dataservice.getCourse(id))
  //   ).subscribe(courses => {
  //     this.journeys = courses.map(course => {
  //       const listened = sessions
  //         .filter(s => s.courseId === course.id)
  //         .map(s => s.trackId);
  //       return { course, listenedto: listened };
  //     });
  //   });
  // }

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
