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
}

export interface Course {
    id: number;
    title: string;
    tags: number[];
}

export interface Tag {
    id: number;
    title: string;
}