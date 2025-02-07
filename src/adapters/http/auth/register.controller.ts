import { Request, Response } from "express";
import { RegisterUser } from "../../../core/usecases/registerUser.usecase";
import { PrismaUserRepository } from "../../persistence/user.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class RegisterController {
    private registerUser: RegisterUser;

    constructor() {
        const userRepository = new PrismaUserRepository(prisma);
        this.registerUser = new RegisterUser(userRepository);
    }

    async register(req: Request, res: Response) {
        try {
            const { name, email, password, role, phoneNumber} = req.body;

            if (!email || !password || !name || !role) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const user = await this.registerUser.execute({ name, email, password, role, phoneNumber});

            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                }
            });

        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}
