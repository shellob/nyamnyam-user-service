import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

declare module "express" {
    interface Request {
        user?: any;
    }
}
// Middleware для проверки токена
export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Добавляем пользователя в req
        next(); // Передаём управление дальше
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return
    }
}
