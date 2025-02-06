import { User } from "../entites/user";
import { PrismaUserRepository } from "../../adapters/persistence/user.repository";
import { RegisterUserDTO } from "../interfaces/DTO/RegisterUserDTO";
import * as bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'

export class RegisterUser {
    constructor(private readonly userRepository: PrismaUserRepository) {}

    async execute(dto: RegisterUserDTO): Promise<User> {
        const exisitingUser = await this.userRepository.findByEmail(dto.email);
        if(exisitingUser) {
            throw new Error("Email is already in use");
        }

        const passwordHash = await bcrypt.hash(dto.password, 12);
        
        const newUser = await User.createNewUser(
            dto.name,
            dto.email,
            dto.password,
            dto.role,
            dto.phoneNumber
        )

        await this.userRepository.create(newUser);

        return new User(
            newUser.id,
            newUser.name,
            newUser.email,
            "SECRET_DATA",
            newUser.role,
            newUser.phoneNumber,
            newUser.profilePicture,
            newUser.isActive,
            newUser.createdAt,
            newUser.updatedAt,
            newUser.deletedAt 
        )
    }
}