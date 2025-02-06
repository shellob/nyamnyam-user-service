import { User } from "../entites/user";

export interface IUserRepository {
    create(user: User): Promise<User>,
    findByEmail(email: string): Promise<User| null>,
    findById(id: string): Promise<User | null>,
    update(user: User, data: Partial<User>): Promise<User>,
    delete(id: string): Promise<void>
}