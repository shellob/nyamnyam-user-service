import { PrismaClient } from "@prisma/client";
import { User } from "../../core/entites/user";

export class PrismaUserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user ? this.mapToEntity(user) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        return user ? this.mapToEntity(user) : null;
    }

    async updateUser(user: User): Promise<User> {
        const updatedUser = await this.prisma.user.update({
            where: {id: user.id},
            data: this.mapToDatabase(user)
        });

        return this.mapToEntity(updatedUser);
    }

    async save(user: User): Promise<User> {
        const newUser = await this.prisma.user.create({
            data: this.mapToDatabase(user),
        });
        return this.mapToEntity(newUser);
    }

    private mapToEntity(user: any): User {
        return new User(
            user.id,
            user.name,
            user.email,
            user.passwordHash,
            user.role,
            user.phoneNumber,
            user.address,
            user.createdAt,
            user.updatedAt
        );
    }

    private mapToDatabase(user: User): any {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            passwordHash: user.passwordHash,
            role: user.role,
            phoneNumber: user.phoneNumber,
            address: user.address,
        };
    }
}
