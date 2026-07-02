import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { Journey, Tag, Track } from '../models/data.models';
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
import { selectAnnouncements, selectSeenBanner, selectTopAnnouncement } from '../state/announcement/announcement.selector';
import { dismissAnnouncement, LoadAnnouncements } from '../state/announcement/announcement.actions';
import { AnnouncementComponent } from '../announcement/announcement.component';

// --- NEW TYPE FOR PAGINATION ---
export type DisplayItem =
  | { type: 'track'; track: Track; isBoat: boolean; isListened: boolean; isLastItem: boolean }
  | { type: 'spacer'; isLastItem: boolean };

@Component({
  selector: 'app-berke',
  imports: [
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
    FormsModule,
    AnnouncementComponent
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
  topAnnouncement = this.store.selectSignal(selectTopAnnouncement)
  seenBanner = this.store.selectSignal(selectSeenBanner)
  bannerTimer: any
  showBanner = signal<boolean>(false)
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

    this.store.dispatch(LoadAnnouncements());
    effect(() => {
      const announcement = this.topAnnouncement();
      const seenBanner = this.seenBanner()
      if (announcement && !announcement.dismissed && !seenBanner) {
        setTimeout(() => {
          this.showBanner.set(true);
        }, 5000);
      }
    })


    this.responsiveOptions = [
      { breakpoint: '1400px', numVisible: 2, numScroll: 1 },
      { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
      { breakpoint: '767px', numVisible: 2, numScroll: 1 },
      { breakpoint: '575px', numVisible: 1, numScroll: 1 }
    ]
  }


  openSupport() {
    this.supportService.open()
  }

  handleAnnouncementAction() {
    this.dismissAnnouncement();
    // Route to the course or feature
  }

  dismissAnnouncement() {
    this.showBanner.set(false);
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

  getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  //NEW METHOD FOR PAGINATION
  getDisplayedTracks(journey: Journey): DisplayItem[] {
    if (!journey.course?.tracks) return [];

    const sortedTracks = [...journey.course.tracks].sort((a, b) => a.dayNumber - b.dayNumber);
    const total = sortedTracks.length;
    const boatTrackId = this.getNextTrackId(journey);
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
      isLastItem: true
    });

    return result;
  }

  handleBannerAction(link: string) {
    this.router.navigate([link]);
  }
}