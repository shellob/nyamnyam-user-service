import { IUserRepository } from "../interfaces/user.repository.interface";

export class DeleteUser {
    constructor(private readonly userRepository: IUserRepository){}

    async execute(id: string){
        const user = await this.userRepository.findById(id);
        if(!user) {
            throw new Error("User not found.");
        }
        return await this.userRepository.delete(id);
    }
}