export enum NotificationType {
    ORDER_UPDATE = "ORDER_UPDATE",
    PROMO = "PROMO",
    SUPPORT = "SUPPORT"
}

export class UserNotification {
    constructor(
        public id: string,
        public userId: string,
        public type: NotificationType,
        public message: string,
        public isRead: boolean = false,
        public createdAt: Date = new Date(),
        public updatedAt?: Date
    ) {}

    markAsRead() {
        this.isRead = true;
        this.updatedAt = new Date();
    }

    updateMessage(newMessage: string) {
        this.message = newMessage;
        this.updatedAt = new Date();
    }
}
