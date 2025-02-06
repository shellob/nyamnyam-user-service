import { User } from "../entites/user";
import { PrismaUserRepository } from "../../adapters/persistence/user.repository";
import * as bcrypt from 'bcrypt'
import { LoginUserDTO } from "../interfaces/DTO/LoginUserDTO";
import { IUserRepository } from "../interfaces/user.repository.interface";

export class LoginUser {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(email: string, password: string) {
        const exisitingUser =  await this.userRepository.findByEmail(email);
        if (!exisitingUser) {
            throw new Error("Can't find user with this email.");
        }
        const isPasswordValid = await exisitingUser.checkPassword(password);
        if (!isPasswordValid) {
            throw new Error("Password is not corrext.")
        }

        return new User(
            exisitingUser.id,
            exisitingUser.name,
            exisitingUser.email,
            "SECRET_DATA",
            exisitingUser.role,
            exisitingUser.phoneNumber,
            exisitingUser.profilePicture,
            exisitingUser.isActive,
            exisitingUser.createdAt,
            exisitingUser.updatedAt,
            exisitingUser.deletedAt
        )

        
    }
}