import express, { Request, Response } from "express";
import { PrismaUserRepository } from "../persistence/user.repository";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();
const router = express.Router();
const userRepository = new PrismaUserRepository();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret";
const REFRESH_KEY = process.env.REFRESH_KEY  || "refresh_secret";


router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await userRepository.findByEmail(email);
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { userId: user.id, role: user.role},
            REFRESH_KEY,
            {expiresIn: "7d"}
        )
        
        await prisma.userSession.create({
            data: {
                userId: user.id,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now()+ 7*24*60*60*1000)
            }
        })
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/refresh", async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return
    }
    
    try {
        // Проверяем, есть ли `refreshToken` в БД
        const session = await prisma.userSession.findUnique({
            where: { refreshToken }
        });

        if (!session) {
            res.status(401).json({message: "Invalid refresh token"});
        }

        if (!session?.expiresAt ||new Date(session.expiresAt) < new Date()) {
            res.status(401).json({message: "Refresh token expired"});
        }
        const decoded = jwt.verify(refreshToken, REFRESH_KEY) as {userId: string};

        const newAccessToken = jwt.sign(
            {userId: decoded.userId},
            SECRET_KEY,
            {expiresIn: "1h"}
        )

        res.json({accessToken: newAccessToken});
} catch (error: any) {
    res.status(403).json({message: "Invalid refresh token"});
    return
}
})

// Экспортируем router
export default router;
