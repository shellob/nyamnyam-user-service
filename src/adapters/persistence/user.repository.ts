import { Prisma, PrismaClient, User as PrismaUser } from "@prisma/client";
import { User } from "../../core/entites/user";
import { IUserRepository } from "../../core/interfaces/user.repository.interface";

export class PrismaUserRepository implements IUserRepository{
    private prisma = new PrismaClient();

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async create(user: User): Promise<User> {
        const newUser = await this.prisma.user.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                passwordHash: user["passwordHash"],
                role: user.role,
                phoneNumber: user.phoneNumber,
                profilePicture: user.profilePicture,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt
            }
        })
        return await this.mapToDomain(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({where: {email}});
        return user ? await this.mapToDomain(user) : null;
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({where: {id}})
        return user ? await this.mapToDomain(user) : null;
    }
    async update(user: User, data: Partial<User>): Promise<User> {
        const updatedUser = await this.prisma.user.update({
            where: {id: user.id},
            data: {
                ...data,
                updatedAt: new Date()
            }
        })

        return await this.mapToDomain(updatedUser);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.update({
            where:{id},
            data: {
                deletedAt: new Date(), isActive: false
            }
        })
    }

    private mapToDomain(prismaUser: PrismaUser): User {
        return new User(
            prismaUser.id,
            prismaUser.name,
            prismaUser.email,
            prismaUser.passwordHash,
            prismaUser.role,
            prismaUser.phoneNumber ?? undefined,
            prismaUser.profilePicture ?? undefined,
            prismaUser.isActive,
            prismaUser.createdAt,
            prismaUser.updatedAt,
            prismaUser.deletedAt ?? null
        );
    }
    
}