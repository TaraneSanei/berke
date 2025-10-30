export interface User {
    id?: number;
    phoneNumber: string;
    username?: string;
    authenticated: boolean;
    minutesListened: number;
    isSubscribed: boolean;
    subscribedAt?: Date;
    subscriptionEnd?: Date;
    preferences?: string[];
    theme: string;
    createdAt?: Date;
}

export interface Course {
    id: number;
    title: string;
    tags: number[];
    tracks: Track[]
}

export interface Tag {
    id: number;
    title: string;
}

export interface Track {
    id: number;
    course: Course;
    title: string;
    dayNumber: number;
    duration: number;
    audioUrl: string;
}

export interface Emotion {
    id: number;
    emotion: string;
}

export interface JourneysSession {
    id?:number;
    courseId: number;
    trackId: number;

}

export interface MeditationSession {
    id?:number;
    dateTime: Date;
    course: string;
    track: string;
    duration: number;
    initialEmotion: Emotion[];
    finalEmotion: Emotion[];
}

export interface Journey {
    course: Course;
    listenedto: number[];
    recommended?: number;
}

export interface Journal {
    id?: number;
    dateTime: Date;
    note: string;
    emotionalStatus?: Emotion[]
}

export interface CalendarSummary {
  date: string;
  journals: number;
  meditations: number;
}

