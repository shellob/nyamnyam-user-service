export type UserRole = "client" | "restaurant" | "admin";

export class User {
    public readonly id: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(
        id: string,
        public name: string,
        public email: string,
        public passwordHash: string,
        public role: UserRole,
        public phoneNumber: string,
        public address: string | null,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    hasRole(role: UserRole): boolean {
        return this.role === role;
    }

    updateAddress(newAddress: string): void {
        if (this.role !== "client") {
            throw new Error("Only clients can update their address.");
        }
        this.address = newAddress;
    }

    updatePhoneNumber(newPhoneNumber: string): void {
        if (!/^\+?\d{10,15}$/.test(newPhoneNumber)) {
            throw new Error("Invalid phone number format");
        }
        this.phoneNumber = newPhoneNumber;
    }
}
