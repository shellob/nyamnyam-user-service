import { User } from "../entites/user";
import { IUserRepository } from "../interfaces/user.repository.interface";

export class GetUserProfile{
    constructor(private readonly userRepository: IUserRepository){}

    async execute(id: string):Promise<User | null> {
        const user = await this.userRepository.findById(id);
        if(!user) {
            throw new Error("User not found.");
        }
        return user;
    }
}