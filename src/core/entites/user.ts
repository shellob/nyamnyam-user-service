import { UserRole } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        private passwordHash: string,
        public role: UserRole,
        public phoneNumber?: string,
        public profilePicture?: string, 
        public isActive: boolean = true,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
        public deletedAt?: Date | null

    ) {}

    static validateEmail(email: string):boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    active() {
        this.isActive = true;
        this.deletedAt = null;
        this.updatedAt = new Date();
    }

    static async createNewUser(
        name: string,
        email: string,
        password: string,
        role: UserRole,
        phoneNumber?: string,
        profilePicture?: string,
    ): Promise<User> {
        if(!this.validateEmail(email)) {
            throw new Error("Invalide email format");
        }

        const passwordHash = await bcrypt.hash(password, 12);

        return new User(
            uuidv4(),
            name,
            email,
            passwordHash,
            role,
            phoneNumber,
            profilePicture,
            true,
            new Date(),
            new Date(),
            null
        )
    }

    deactive() {
        this.isActive = false;
        this.updatedAt = new Date();
        this.deletedAt = new Date();
    }

    isDeleted() {
        return !!this.deletedAt;
    }

    async checkPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.passwordHash);
    }

    async changePassword(newPassword: string) {
        this.passwordHash = await bcrypt.hash(newPassword, 12);
        this.updatedAt = new Date();
    }

    async updateProfile(name: string, phoneNumber: string, profilePicture: string) {
        if (name) {
            this.name = name;
        }
        if (phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        if(profilePicture) {
            this.profilePicture = profilePicture;
        }

        this.updatedAt = new Date();
    }
}