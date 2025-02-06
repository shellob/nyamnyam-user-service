import { Request, Response } from "express";
import { DeleteUser } from "../../../core/usecases/deleteUser.usecase";
import { PrismaUserRepository } from "../../persistence/user.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class DeleteUserController {
    private deleteUser: DeleteUser;

    constructor() {
        const userRepository = new PrismaUserRepository(prisma);
        this.deleteUser = new DeleteUser(userRepository);
    }

    async delete(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            await this.deleteUser.execute(userId);
            return res.status(200).json({ message: "User deleted successfully" });

        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}
