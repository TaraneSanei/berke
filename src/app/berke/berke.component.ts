import { Component, computed, effect, inject, signal } from '@angular/core';
import { WindowDirective } from '../shared/directives/window.directive';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { Course, Journey, Tag } from '../models/data.models';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';
import { CommonModule } from '@angular/common';
import { WaveDirective } from '../shared/directives/wave.directive';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BerkeService } from '../shared/services/berke.service';
import { selectPreferences, selectUser } from '../state/user/user.selector';
import { CarouselModule } from 'primeng/carousel';
import { timeIconMap } from '../shared/utils/time.map';
import { DomSanitizer } from '@angular/platform-browser';
import { RecommendationService } from '../shared/services/recommendation.service';
import { SupportService } from '../shared/services/support.service';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';
import { FormsModule } from "@angular/forms";
@Component({
  selector: 'app-berke',
  imports: [
    WindowDirective,
    WaveDirective,
    ButtonModule,
    FloatLabelModule,
    DatePickerModule,
    TextareaModule,
    MultiSelectModule,
    CommonModule,
    PersianDigitsPipe,
    SelectButtonModule,
    CarouselModule,
    SafeHtmlPipe,
    FormsModule
  ],
  templateUrl: './berke.component.html',
  styleUrl: './berke.component.css'
})
export class BerkeComponent {

  private supportService = inject(SupportService)
  private sanitizer = inject(DomSanitizer)
  private router = inject(Router);
  private berkeService = inject(BerkeService);
  private store = inject(Store<AppState>);
  private recommendationService = inject(RecommendationService)
  tags = this.berkeService.tags;
  courses = this.berkeService.courses;
  featuredJourney = this.recommendationService.featuredJourney
  newest = this.recommendationService.newCourses
  recommendedCourses = this.recommendationService.recommendedCourses
  skillCourses = this.recommendationService.skillCourses
  deepCourses = this.recommendationService.deepCourses
  userPreferences = this.store.selectSignal(selectPreferences)
  userProfile = this.store.selectSignal(selectUser)
  timeIcons: Record<string, any> = {};
  responsiveOptions: any[] | undefined;
  selectedTags = signal<Tag[]>([])
  filteredCourses = computed(() => {
    const allCourses = this.courses();
    const currentTags = this.selectedTags();
    if (currentTags.length === 0) {
      return allCourses;
    }
    const selectedTagIds = currentTags.map(tag => tag.id);
    return allCourses.filter(course =>
      course.tags.some(tagId => selectedTagIds.includes(tagId))
    );
  });
  displayLimit = signal(6);

  displayedCourses = computed(() => {
    return this.filteredCourses().slice(0, this.displayLimit());
  });

  loadMore() {
    this.displayLimit.update(n => n + 6); // Increase by 6 each time
  }

  hasMore = computed(() => {
    return this.displayLimit() < this.filteredCourses().length;
  });
  constructor() {


    Object.entries(timeIconMap).forEach(([key, svgString]) => {
      this.timeIcons[key] = this.sanitizer.bypassSecurityTrustHtml(svgString);
    });

    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
      }
    ]


  }

  openSupport() {
    this.supportService.open()
  }

  journal() {
    this.router.navigate(['/journal']);
  }

  goToCourse(courseId: number) {
    this.router.navigate(['/course', courseId]);
  }

  getNextTrackId(journey: Journey): number | null {
    if (!journey.course?.tracks || !journey.listenedto) return null;
    const sortedTracks = [...journey.course.tracks].sort((a, b) => a.dayNumber - b.dayNumber);

    const nextTrack = sortedTracks.find(track => !journey.listenedto.includes(track.id));
    return nextTrack ? nextTrack.id : null;
  }

  calculateSyncLevel(journey: Journey) {
    return journey.listenedto.length / journey.course.tracks.length;
  }

  //helper function to find out what time of day it is
  getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }
}
