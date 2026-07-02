export interface User {
    id?: number;
    phoneNumber: string;
    username?: string;
    authenticated: boolean;
    secondsListened: number;
    isSubscribed: boolean;
    subscribedAt?: Date;
    subscriptionEnd?: Date;
    preferences?: number[];
    theme: string;
    createdAt?: Date;
    notification?: string;
    hasAccess?: boolean;
    hasPassword: boolean
}

export interface Course {
    id: number;
    title: string;
    description: string;
    tags: number[];
    tracks: Track[];
    iconPath: string;
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
    track: Track | undefined;
    duration: number;
    initialEmotion: Emotion[];
    finalEmotion: Emotion[];
}

export interface Journey {
    course: Course;
    listenedto: number[];
    recommended?: number;
    latestSessionId?: number;
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

export interface SubscriptionPlan {
    id: number;
    name: string;
    description: string;
    duration: number;
    price: number;
}

export interface Order {
    id: string;
    plan: SubscriptionPlan;
    amount: number;
    status: string;
    date: Date;
}

export interface Announcement {
    id: string;
    title: string;
    message: string;
    bannerSvg: string;
    linkText: string;
    link: string;
    dismissed: boolean
}