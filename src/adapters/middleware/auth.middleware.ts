import { Request, Response, NextFunction, RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

// Расширяем Request для добавления `user`
declare module "express-serve-static-core" {
    interface Request {
        user?: any;
    }
}

// Middleware для проверки JWT
export const authenticateJWT: RequestHandler = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return; 
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Добавляем пользователя в req
        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return;
    }
};
