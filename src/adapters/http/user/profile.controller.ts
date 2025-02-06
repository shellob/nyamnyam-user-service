import { Request, Response } from "express";
import { PrismaUserRepository } from "../../persistence/user.repository";
import { PrismaClient } from "@prisma/client";

const prisma  = new PrismaClient();
export class ProfileController {
    private userRepository: PrismaUserRepository;

    constructor() {
        this.userRepository = new PrismaUserRepository(prisma);
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user.id;

            const user = await this.userRepository.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                profilePicture: user.profilePicture
            });

        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
