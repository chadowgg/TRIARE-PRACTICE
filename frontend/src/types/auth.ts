export interface AuthResponse {
    access_token: string;
}

export interface UserProfile {
    userId: number;
    email: string;
    name?: string;
}