import { Request, Response } from "express";
import { LogoutUser } from "../../../core/usecases/logoutUser.usecase";
import { PrismaUserRepository } from "../../persistence/user.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class LogoutController {
    private logoutUser: LogoutUser;

    constructor() {
        const userRepository = new PrismaUserRepository(prisma);
        this.logoutUser = new LogoutUser(userRepository);
    }

    async logout(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            await this.logoutUser.execute(userId);
            return res.status(200).json({ message: "Logged out successfully" });

        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}
