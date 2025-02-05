import { User } from "../entites/user";
import { PrismaUserRepository } from "../../adapters/persistence/user.repository";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

interface RegisterUserDTO {
    name: string;
    email: string;
    password: string;
    role: "client" | "restaurant" | "admin";
}

export class RegisterUser {
    constructor(private readonly userRepository: PrismaUserRepository) {}

    async execute(dto: RegisterUserDTO): Promise<User> {
        // 🔹 Проверяем валидность email
        if (!User.validateEmail(dto.email)) {
            throw new Error("❌ Invalid email format");
        }

        // 🔹 Проверяем, существует ли уже пользователь с таким email
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new Error("❌ Email is already in use");
        }

        // 🔹 Хешируем пароль перед сохранением
        const passwordHash = await bcrypt.hash(dto.password, 12);

        // 🔹 Создаем нового пользователя
        const newUser = new User(
            uuidv4(), // Генерируем UUID для пользователя
            dto.name,
            dto.email,
            passwordHash,
            dto.role,
            "",
            null,
            new Date(),
            new Date()
        );

        // 🔹 Сохраняем пользователя в базе
        return await this.userRepository.save(newUser);
    }
}
