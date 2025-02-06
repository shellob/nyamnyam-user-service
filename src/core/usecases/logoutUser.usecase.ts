import { IUserRepository } from "../interfaces/user.repository.interface";

export class LogoutUser {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        
        if (!user) {
            throw new Error("User not found.");
        }

        // Очищаем refresh-токен пользователя
        await this.userRepository.clearRefreshToken(userId);
    }
}
