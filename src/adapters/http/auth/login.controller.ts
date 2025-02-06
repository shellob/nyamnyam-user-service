import { Request, Response } from "express";
import { LoginUser } from "../../../core/usecases/loginUser.usecase";
import { PrismaUserRepository } from "../../persistence/user.repository";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

const prisma = new PrismaClient();
export class LoginController {
    private loginUser: LoginUser;

    constructor() {
        const userRepository = new PrismaUserRepository(prisma);
        this.loginUser = new LoginUser(userRepository);
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await this.loginUser.execute(email, password);

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            return res.status(200).json({ 
                message: "Login successful", 
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    profilePicture: user.profilePicture,
                    isActive: user.isActive
                }
            });

        } catch (error:any) {
            return res.status(401).json({ message: error.message });
        }
    }
}
