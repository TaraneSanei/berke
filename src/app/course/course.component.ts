import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, Track } from '../models/data.models';
import { DataService } from '../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';
import { selectUser } from '../state/user/user.selector';
import { selectJourneys } from '../state/journeys/journeys.selector';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { LoadJourneys } from '../state/journeys/journeys.actions';
import { WaveDirective } from '../shared/directives/wave.directive';

@Component({
  selector: 'app-course',
  imports: [
    CommonModule,
    ButtonModule,
    PersianDigitsPipe,
    SafeHtmlPipe,
    WaveDirective
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private store = inject(Store<AppState>);

  courseData = signal<Course | null>(null);
  userProfile = this.store.selectSignal(selectUser);
  journeys = this.store.selectSignal(selectJourneys);

  listenedTo = computed(() => {
    const courseId = this.courseData()?.id;
    if (!courseId) return [];
    const journey = this.journeys().find(j => j.course.id === courseId);
    return journey ? journey.listenedto : [];
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('courseId'));
    this.dataService.getCourse(id.toString()).subscribe({
        next: (course) => {
            this.courseData.set(course);
        },
        error: (err) => { console.error('Failed to load course metadata:', err); }
    });
    
    effect(() => {
      this.store.dispatch(LoadJourneys());
    })

  }

  getNextTrackId(): number | null {
    const course = this.courseData();
    const listened = this.listenedTo();
    
    if (!course?.tracks) return null;
    
    const sortedTracks = [...course.tracks].sort((a, b) => a.dayNumber - b.dayNumber);
    const nextTrack = sortedTracks.find(track => !listened.includes(track.id));
    
    return nextTrack ? nextTrack.id : null;
  }

  playTrack(track: Track) {
    this.router.navigate(['/play', track.id]);
  }


    syncLevel = computed(() => {
    const course = this.courseData();
    const listened = this.listenedTo();
    
    if (!course || !course.tracks || course.tracks.length === 0) return 0;
    
    const totalTracks = course.tracks.length;
    const completedCount = course.tracks.filter(t => listened.includes(t.id)).length;
    
    return (completedCount / totalTracks);
  });
}
