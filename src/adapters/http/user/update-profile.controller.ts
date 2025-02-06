import { Request, Response } from "express";
import { UpdateUser } from "../../../core/usecases/updateUserProfile.usecase";
import { PrismaUserRepository } from "../../persistence/user.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class UpdateProfileController {
    private updateUser: UpdateUser;

    constructor() {
        const userRepository = new PrismaUserRepository(prisma);
        this.updateUser = new UpdateUser(userRepository);
    }

    async update(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const { name, phoneNumber, profilePicture } = req.body;

            const updatedUser = await this.updateUser.execute(userId, { name, phoneNumber, profilePicture });

            return res.status(200).json({
                message: "Profile updated successfully",
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    phoneNumber: updatedUser.phoneNumber,
                    profilePicture: updatedUser.profilePicture
                }
            });

        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}
