import {User} from "../entites/user"
import { PrismaUserRepository } from "../../adapters/persistence/user.repository"
import * as bcrypt from "bcrypt"

interface RegisterUserDTO {
    name: string;
    email: string;
    password: string;
    role: "client" | "restaurant" | "admin";
}

export class RegisterUser {
    private userRepository: PrismaUserRepository;

    constructor (userRepository: PrismaUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(dto: RegisterUserDTO): Promise<User> {
        if (!User.validateEmail(dto.email)){
            throw new Error("Invalid email format");
        }

        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new Error("Email already in use");
        }
        const passwordHash = await bcrypt.hash(dto.password, 12)

        const newUser = new User(
            crypto.randomUUID(),
            dto.name,
            dto.email,
            passwordHash,
            dto.role,
            "",
            null,
            new Date(),
            new Date()
        )

        return this.userRepository.save(newUser);
    }
}