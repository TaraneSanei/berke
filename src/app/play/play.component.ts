import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { WindowDirective } from "../shared/directives/window.directive";
import { WaveDirective } from "../shared/directives/wave.directive";
import { Emotion, MeditationSession, Track } from '../models/data.models';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { EmotionIconComponent } from '../shared/components/emotion-icon/emotion-icon.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { BerkeService } from '../shared/services/berke.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { LoadMeditationSession } from '../state/meditationsSessions/meditationSessions.actions';
import { selectMeditationSessions } from '../state/meditationsSessions/meditationSessions.selector';

@Component({
  selector: 'app-play',
  imports: [
    WindowDirective,
    WaveDirective,
    CommonModule,
    DialogModule,
    EmotionIconComponent,
    MultiSelectModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './play.component.html',
  styleUrl: './play.component.css'
})
export class PlayComponent implements OnInit {

  @ViewChild('audio') audioRef!: ElementRef<HTMLAudioElement>;
  initialEmotionDialog = signal(false);
  track?: Track;
  isPlaying = signal(false);
  progress = 0
  circumference = 2 * Math.PI * 120;
  meditationSession : MeditationSession ={
    dateTime: new Date(),
    track: '',
    duration: 0,
    course: '',
    initialEmotion: [],
    finalEmotion: [],
  }
  berkeService = inject(BerkeService);
  emotions = this.berkeService.emotions
  meditationSessions = signal<MeditationSession[]>([])

  constructor(private route: ActivatedRoute, private dataService: DataService, private store: Store<AppState>) {
    this.berkeService.loadEmotions()
    effect(() => {
      const meditationSessionsData = this.store.selectSignal(selectMeditationSessions)
      this.meditationSessions.set(meditationSessionsData())
    })
   }


  ngOnInit() {
    const trackId = Number(this.route.snapshot.paramMap.get('trackId'));
    this.track = this.findTrackById(trackId);
    this.store.dispatch(LoadMeditationSession({ date: new Date().toISOString().split('T')[0] }));
    this.meditationSessions
    if (this.track) {
      this.initialEmotionDialog.set(true);
      this.meditationSession.track = this.track.title;

    } else {
      console.log('handle not found error');
    }
  }

  private findTrackById(trackId: number): Track | undefined {
    for (const course of this.dataService.getCoursesCache().values()) {
      const found = course.tracks.find(t => t.id === trackId);
      if (found) return found;
    }
    return undefined;
  }

    play() {
    const audio = this.audioRef.nativeElement;
    audio.play();
    this.isPlaying.set(true);
  }

    pause() {
    const audio = this.audioRef.nativeElement;
    audio.pause();
    this.isPlaying.set(false);
  }


  removeEmotion(item: Emotion, selected: Emotion[]) {
    const updated = selected.filter(s => s.emotion !== item.emotion);
    this.meditationSession.initialEmotion = [...updated];
  }
    togglePlay() {
      console.log('Toggle play');
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

    updateProgress() {
    const audio = this.audioRef.nativeElement;
    if (audio.duration > 0) {
      this.progress = audio.currentTime / audio.duration;
    }
  }

  startMeditationSession(){
    this.play()
  }

  private within30Minutes(dateTime: string): boolean {
  const diff = Date.now() - new Date(dateTime).getTime();
  return diff < 30 * 60 * 1000;
}

}
