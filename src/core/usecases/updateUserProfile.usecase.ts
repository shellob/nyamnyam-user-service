import { UpdateUserDTO } from "../interfaces/DTO/UpdateUserDTO";
import { IUserRepository } from "../interfaces/user.repository.interface";

export class UpdateUser{
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(id: string, updates: UpdateUserDTO) {
        const user = await this.userRepository.findById(id);
        if(!user) {
            throw new Error("User not found.");
        }

        user.updateProfile(updates.name || user.name, updates.phoneNumber || user.phoneNumber, updates.profilePicture || user.profilePicture);
        
        return this.userRepository.update(user);
    }
}