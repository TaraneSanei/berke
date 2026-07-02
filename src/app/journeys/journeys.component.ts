import { Component, effect, inject, signal } from '@angular/core';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import { LoadJourneys } from '../state/journeys/journeys.actions';
import { selectJourneys } from '../state/journeys/journeys.selector';
import { Course, Journey, JourneysSession, Track } from '../models/data.models';
import { CommonModule } from '@angular/common';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe'
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { WaveDirective } from "../shared/directives/wave.directive";
import { Router } from '@angular/router';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';
import { ButtonModule } from 'primeng/button';
import { selectUser } from '../state/user/user.selector';

export type DisplayItem = 
  | { type: 'track'; track: Track; isBoat: boolean; isListened: boolean; isLastItem: boolean }
  | { type: 'spacer'; isLastItem: boolean };

@Component({
  selector: 'app-journeys',
  imports: [
    CommonModule,
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
  private store = inject(Store<AppState>);

  userProfile = this.store.selectSignal(selectUser)

  constructor() {
    effect(() => {
      this.store.dispatch(LoadJourneys());
    })

    effect(() => {
      const journeysData = this.store.selectSignal(selectJourneys)
      this.journeys.set(journeysData())
    })
  }

  toggleExpanded(journey: Journey) {
    if (this.expanded() !== journey.course.id) {
      this.expanded.set(journey.course.id)
    } else {
      this.expanded.set(null)
    }
  }

  calculateSyncLevel(journey: Journey) {
    return journey.listenedto.length / journey.course.tracks.length;
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

  // --- NEW METHOD FOR PAGINATION ---
  getDisplayedTracks(journey: Journey): DisplayItem[] {
    if (!journey.course?.tracks) return [];
    
    const sortedTracks = [...journey.course.tracks].sort((a, b) => a.dayNumber - b.dayNumber);
    const total = sortedTracks.length;
    const boatTrackId = this.getNextTrackId(journey);

    // If 7 sessions or under, just show all of them normally
    if (total <= 7) {
      return sortedTracks.map((track, i) => ({
        type: 'track',
        track,
        isListened: journey.listenedto.includes(track.id),
        isBoat: track.id === boatTrackId,
        isLastItem: i === total - 1
      }));
    }

    // Determine the active window around the boat icon
    let currentIndex = boatTrackId ? sortedTracks.findIndex(t => t.id === boatTrackId) : total - 1;
    if (currentIndex === -1) currentIndex = total - 1;

    const result: DisplayItem[] = [];

    // 1. Always show the first session
    result.push({
      type: 'track',
      track: sortedTracks[0],
      isListened: journey.listenedto.includes(sortedTracks[0].id),
      isBoat: sortedTracks[0].id === boatTrackId,
      isLastItem: false
    });

    // 2. Add left spacer if we are far from the start
    if (currentIndex > 2) {
      result.push({ type: 'spacer', isLastItem: false });
    }

    // 3. Add the window: Prev, Current (Boat), Next
    const startWindow = Math.max(1, currentIndex - 1);
    const endWindow = Math.min(total - 2, currentIndex + 1);

    for (let i = startWindow; i <= endWindow; i++) {
      result.push({
        type: 'track',
        track: sortedTracks[i],
        isListened: journey.listenedto.includes(sortedTracks[i].id),
        isBoat: sortedTracks[i].id === boatTrackId,
        isLastItem: false
      });
    }

    // 4. Add right spacer if we are far from the end
    if (currentIndex < total - 3) {
      result.push({ type: 'spacer', isLastItem: false });
    }

    // 5. Always show the last session
    result.push({
      type: 'track',
      track: sortedTracks[total - 1],
      isListened: journey.listenedto.includes(sortedTracks[total - 1].id),
      isBoat: sortedTracks[total - 1].id === boatTrackId,
      isLastItem: true // Signals the HTML not to draw a connecting line after this
    });

    return result;
  }
}