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