import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { Emotion, MeditationSession, Track } from '../models/data.models';
import { DataService } from '../shared/services/data.service';
import { BerkeService } from '../shared/services/berke.service';
import { AppState } from '../state/app.state';
import { AddMeditationSession, LoadMeditationSession, UpdateMeditationSession } from '../state/meditationsSessions/meditationSessions.actions';
import { selectMeditationSessions, selectmeditationSessionsStatus } from '../state/meditationsSessions/meditationSessions.selector';
import { WaveDirective } from "../shared/directives/wave.directive";
import { EmotionIconComponent } from '../shared/components/emotion-icon/emotion-icon.component';
import { firstValueFrom, Observable, of, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-play',
    standalone: true,
    imports: [
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
export class PlayComponent implements OnInit, OnDestroy {

    private routerSub!: Subscription;
    private router = inject(Router);
    private berkeService = inject(BerkeService);
    private route = inject(ActivatedRoute);
    private dataService = inject(DataService);
    private store = inject(Store<AppState>);
    private http = inject(HttpClient);
    emotions = this.berkeService.emotions
    audio = signal<HTMLAudioElement | null>(null)
    trackData = signal<Track | null>(null)
    meditationSessions = signal<MeditationSession[]>([])
    meditationSessionsStatus: any;
    currentSession = signal<MeditationSession | null>(null);
    recentSession = signal<MeditationSession | null>(null);
    currentTime = signal<number>(0);
    duration = signal<number>(0);
    initialEmotionDialog = signal(false);
    finalEmotionDialog = signal(false)
    resumeDialog = signal(false)
    initialEmotion: Emotion[] = []
    finalEmotion: Emotion[] = []
    isPlaying = signal(false)
    initialCheckCompleted = signal<boolean>(false);
    endSignal$ = new Subject<boolean>();
    private currentBlobUrl: string | null = null;
    readonly CIRCUMFERENCE: number = 2 * Math.PI * 36;
    isPreparingAudio = signal(false);
    circumference = this.CIRCUMFERENCE;


    constructor() {
        const id = Number(this.route.snapshot.paramMap.get('trackId'));
        this.dataService.getTrack(id).subscribe({
            next: (track) => {
                this.trackData.set(track);
                console.log(track)
            },
            error: (err) => { console.error('Failed to load track metadata:', err); }
        });
        this.berkeService.loadEmotions();
        this.meditationSessionsStatus = this.store.selectSignal(selectmeditationSessionsStatus)
        effect(() => {
            console.log('this.recentSession():', this.recentSession())
        })

        effect(() => {
            console.log('this.currentSession():', this.currentSession())
        })

        effect(() => {
            console.log('this.currentTime():', this.currentTime())
        })
        effect(() => {
            const meditationSessionsData = this.store.selectSignal(selectMeditationSessions);
            this.meditationSessions.set(meditationSessionsData());
            this.checkForRecentSession();

            console.log('Meditation Sessions updated:', this.meditationSessions());
        });

        effect(() => {
            this.store.dispatch(LoadMeditationSession({ date: new Date().toISOString().split('T')[0] }));
        });


        effect(() => {
            const resolution = this.sessionResolutionStatus();
            if (resolution === 'LOADING' || this.initialCheckCompleted()) {
                return;
            }

            if (resolution.type === 'RESUME') {
                this.recentSession.set(resolution.session ? resolution.session : null);
                this.resumeDialog.set(true);
                this.initialEmotionDialog.set(false);

            } else if (resolution.type === 'NEW') {
                this.newMeditationSession();
            }

            this.initialCheckCompleted.set(true);

        });

        effect(() => {
            const sessions = this.meditationSessions();

            const current = this.currentSession();
            if (!current) return;

            // If the current session has no ID yet, check if the backend returned one
            if (!current.id) {
                const match = sessions.find(s =>
                    s.track?.id === current.track?.id &&
                    new Date(s.dateTime).getTime() === new Date(current.dateTime).getTime()
                );

                if (match) {
                    // Update currentSession with the backend version (now with ID)
                    this.currentSession.set(match);
                    console.log("currentSession updated with backend ID:", match);
                }
            }
        });

    }

    ngOnInit(): void {
    }


    endSession(): Observable<boolean> {
        this.handlePause()
        this.updateMeditationSession()
        this.finalEmotionDialog.set(true)
        return this.endSignal$.asObservable();
    }

    endMeditationSession() {
        this.updateMeditationSession();
        this.endSignal$.next(true);
        this.endSignal$.complete();
    }

    updateMeditationSession() {
        const session = this.currentSession();
        if (!session) return;
        const updated: MeditationSession = { ...session, finalEmotion: this.finalEmotion, duration: Math.floor(this.currentTime()) }
        console.log(updated)
        this.store.dispatch(UpdateMeditationSession({ session: updated }))
    }

    syncLevel = computed(() => {
        const track = this.trackData()
        if (!track) return 0;
        return this.currentTime() / track.duration || 0;
    })


    progressOffset = computed(() => {
        return this.CIRCUMFERENCE * (1 - this.syncLevel());
    })

    sessionResolutionStatus = computed(() => {
        const status = this.meditationSessionsStatus();
        if (status !== 'success') {
            return 'LOADING';
        }
        const recentSessionResult = this.checkForRecentSession();
        if (recentSessionResult) {
            return { type: 'RESUME', session: recentSessionResult };
        } else {
            return { type: 'NEW' };
        }
    });

    checkForRecentSession() {
        const sessions = this.meditationSessions();
        console.log('Meditation Sessions:', sessions);
        const track = this.trackData();
        const cutoffTime = 30 * 60 * 1000;
        const now = new Date().getTime();
        return sessions.find(session => {
            const sessionDate = new Date(session.dateTime).getTime();
            const sessionAge = now - sessionDate;
            const isUserUnfinished = session.finalEmotion.length === 0;
            const isUnfinished = session.duration !== track!.duration;
            const isRecent = sessionAge < cutoffTime;
            const isSameTrack = session.track?.id === track!.id;
            return (isSameTrack && isRecent && isUserUnfinished && isUnfinished)
        }) || null

    }

    newMeditationSession() {
        this.currentSession.set({
            dateTime: new Date(),
            track: this.trackData()!,
            duration: 0,
            course: this.trackData()!.course.title,
            initialEmotion: [],
            finalEmotion: [],
        });
        this.initialEmotionDialog.set(true)
        this.resumeDialog.set(false)

    }
    async startMeditationSession() {
        console.log(this.currentSession())
        const session = this.currentSession()
        if (!session) return;
        const updated: MeditationSession = { ...session, initialEmotion: this.initialEmotion, finalEmotion: this.finalEmotion }
        this.currentSession.set(updated);
        this.store.dispatch(AddMeditationSession({ session: this.currentSession()! }))
        this.initialEmotionDialog.set(false)

        await this.createAndSetAudioSource(0); // Await the blob creation
        this.togglePlayPause()
    }

    async resumeMeditationSession() {
        const recentSession = this.recentSession()
        if (!recentSession) {
            console.error("currentsession doesn't exist")
            return;
        }
        this.currentSession.set(recentSession);
        console.log('Resuming session found.');

        this.currentTime.set(recentSession.duration)
        if (this.isPreparingAudio()) return;
        this.isPreparingAudio.set(true);

        await this.createAndSetAudioSource(recentSession.duration);
        this.togglePlayPause()

        this.initialEmotionDialog.set(false);
        this.resumeDialog.set(false)
    }

    seek(duration: number) {
        console.log('Seeked to:', this.currentTime);

        const audio = this.audio();
        if (!audio) return;
        audio.currentTime = audio.currentTime + duration;
        this.currentTime.set(audio.currentTime);
    }

    backToJourneys() {
        this.router.navigate(['/journeys']);
    }
    async createAndSetAudioSource(resumeTime: number): Promise<HTMLAudioElement | null> {
        const track = this.trackData();
        if (!track) {
            console.error("Track data missing or audio already created.");
            return null;
        }

        const audio = new Audio();
        audio.preload = 'auto';
        this.addAudioListeners(audio);

        try {
            const { audio_url } = await firstValueFrom(this.dataService.getTrackUrl(track.id));
            // 2. Fetch the audio as a Blob (bypasses Angular Auth Interceptors)
            const blob = await firstValueFrom(
                this.http.get(audio_url, { responseType: 'blob' })
            );
            

            this.currentBlobUrl = URL.createObjectURL(blob);

            audio.src = this.currentBlobUrl;
            audio.currentTime = resumeTime;
            audio.load();
            this.audio.set(audio);
            console.log('Audio ready via Blob URL:', this.currentBlobUrl);
            return audio;

        } catch (err) {
            console.error("Failed to load audio source:", err);
            return null;
        } finally {
      this.isPreparingAudio.set(false);
    }
    }


    private handleLoadedMetadata = () => {
        const audio = this.audio();
        if (audio) {
            this.duration.set(audio.duration);
        }
    };

    private handleTimeUpdate = () => {
        const audio = this.audio();
        if (audio) {
            this.currentTime.set(audio.currentTime);
        }
    };

    private handlePlaying = () => {
        const audio = this.audio();
        if (!audio) return;
        audio.play()
        this.isPlaying.set(true)
    };

    private handlePause = () => {
        const audio = this.audio();
        if (!audio) return;
        audio.pause()
        this.isPlaying.set(false)
    };

    private handleEnded = () => {
        this.backToJourneys()
    };

    private handleCanPlayThrough = () => {
        // Audio is now ready to play
    };

    private handleError = (e: Event) => {
        console.error('Audio playback error:', e);
        this.isPlaying.set(false);
    };

    private addAudioListeners(audio: HTMLAudioElement): void {
        audio.addEventListener('loadedmetadata', this.handleLoadedMetadata);
        audio.addEventListener('timeupdate', this.handleTimeUpdate);
        audio.addEventListener('ended', this.handleEnded);
        audio.addEventListener('playing', this.handlePlaying);
        audio.addEventListener('pause', this.handlePause);
        audio.addEventListener('canplaythrough', this.handleCanPlayThrough);
        audio.addEventListener('error', this.handleError);
    }


    async togglePlayPause(): Promise<void> {
        let audio = this.audio();
        const session = this.currentSession();
        if (!session) {
            console.warn("Cannot toggle play: Session is missing or currently loading.");
            return;
        }

        if (!audio) {
            audio = await this.createAndSetAudioSource(session.duration); // Await the blob creation
        }

        if (!audio) return; // Exit if creation failed
        if (this.isPlaying()) {
            audio.pause();
            this.isPlaying.set(false)
        } else {
            audio.play().catch(e => {
                console.warn('Playback failed, user action may be restricted:', e);
            });
            this.isPlaying.set(true)
        }
    }
    removeEmotion(item: Emotion, selected: Emotion[]) {
        const idx = selected.findIndex(s => s.emotion === item.emotion);
        if (idx > -1) {
            selected.splice(idx, 1);
        }
    }



    private removeAudioListeners(audio: HTMLAudioElement): void {
        audio.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
        audio.removeEventListener('timeupdate', this.handleTimeUpdate);
        audio.removeEventListener('ended', this.handleEnded);
        audio.removeEventListener('playing', this.handlePlaying);
        audio.removeEventListener('pause', this.handlePause);
        audio.removeEventListener('canplaythrough', this.handleCanPlayThrough);
        audio.removeEventListener('error', this.handleError);
    }

    ngOnDestroy() {
        const audio = this.audio();
        if (audio) {
            audio.pause();
            this.saveSessionUpdate(audio.currentTime);
            this.removeAudioListeners(audio);
            this.audio.set(null);
        }

        // Clean up the Blob URL from memory
        if (this.currentBlobUrl) {
            URL.revokeObjectURL(this.currentBlobUrl);
            this.currentBlobUrl = null;
        }
    }

    saveSessionUpdate(currentTime: number) {

    }

}
