import { computed, effect, inject, Injectable, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { selectPreferences } from '../../state/user/user.selector';
import { Course, Journey } from '../../models/data.models';
import { selectJourneys } from '../../state/journeys/journeys.selector';
import { LoadJourneys } from '../../state/journeys/journeys.actions';
import { BerkeService } from './berke.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private store = inject(Store<AppState>);
  private berkeService = inject(BerkeService);

  // 1. Data Sources (Signals)
  // We point directly to the service signals so everything is reactive
  private courses = this.berkeService.courses;
  private tagsMap = this.berkeService.recommendationMap;
  private userPreferences = this.store.selectSignal(selectPreferences);
  private journeys = this.store.selectSignal(selectJourneys);

  // 2. Internal Helper Signal
  private interactedCourseIds = computed(() =>
    new Set(this.journeys().map(j => j.course.id))
  );

  constructor() {
    // Trigger initial data load
    this.store.dispatch(LoadJourneys());
    this.berkeService.loadCourses();
    this.berkeService.loadTags();
    this.berkeService.loadRecommendationMap();


    effect(() => {
      console.log('recommendationMap', this.tagsMap());
    })

    effect(() => {
      console.log('newCourses', this.newCourses());
    })
    effect(() => {
      console.log('recommendedCourses', this.recommendedCourses());
    })
    effect(() => {
      console.log('courses', this.courses());
    })
  }


  // --- Computed Outputs for Components ---

  public featuredJourney = computed(() => {
    const journeys = this.journeys();
    if (!journeys.length) return null;

    // Returns the first journey that isn't finished
    return journeys.find(j => !this.isJourneyFinished(j)) || null;
  });

  public newCourses = computed(() => {
    const ids = this.tagsMap()['new'] || [];
    return this.filterAndSort(ids, true);
  });

  public recommendedCourses = computed(() => {
    const map = this.tagsMap();
    const circadianIds = map[this.getTimeOfDay()] || [];
    let recommendation = this.filterAndSort(circadianIds, true);

    // If initiation is recommended, prepend course ID 7
    if (this.recommendInitiation()) {
      const initiationCourse = this.courses().find(c => c.id === 7);
      if (initiationCourse) {
        recommendation = [initiationCourse, ...recommendation];
      }
    }
    return recommendation;
  });

  public skillCourses = computed(() => {
    const ids = this.tagsMap()['skills'] || [];
    return this.filterAndSort(ids, true);
  });

  public deepCourses = computed(() => {
    const ids = this.tagsMap()['deep'] || [];
    return this.filterAndSort(ids, true);
  });

  private filterAndSort(allowedIds: number[], sortByPrefs: boolean): Course[] {
    const all = this.courses();
    const interacted = this.interactedCourseIds();
    const prefs = this.userPreferences();
    let filtered = all!.filter(course =>
      !interacted.has(course.id) &&
      course.tags.some(t => allowedIds.includes(t))
    );

    if (sortByPrefs && prefs) {
      filtered = [...filtered].sort((a, b) => {
        const aMatches = a.tags.some(t => prefs.includes(t)) ? 1 : 0;
        const bMatches = b.tags.some(t => prefs.includes(t)) ? 1 : 0;
        return bMatches - aMatches;
      });

    }
    return filtered.map(c => c);
  }

  private recommendInitiation(): boolean {
    const journeys = this.journeys();
    const preferences = this.userPreferences() || [];

    // Tag ID 1 = "Beginner" (Assuming from your logic)
    const isBeginner = preferences.includes(1);
    const hasStartedInitiation = journeys.some(j => j.course.id === 7);

    return isBeginner && !hasStartedInitiation;
  }

  private isJourneyFinished(journey: Journey): boolean {
    if (!journey.course?.tracks) return false;
    return journey.listenedto.length >= journey.course.tracks.length;
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }
}