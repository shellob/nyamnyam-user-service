export class UserSession {
    constructor(
        public id: string,
        public userId: string,
        public refreshToken: string,
        public expiresAt: Date,
        public createdAt: Date = new Date(),
        public updatedAt?: Date,
        public userAgent?: string,
        public ipAddress?: string
    ) {}

    isExpired(): boolean {
        return new Date() > this.expiresAt;
    }

    updateRefreshToken(newToken: string, expiresInDays: number) {
        this.refreshToken = newToken;
        this.expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
        this.updatedAt = new Date();
    }

    invalidateSession() {
        this.expiresAt = new Date(); // Немедленно истекает
        this.updatedAt = new Date();
    }
}
