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

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: "Forbidden: Invalid token" });
            return;
        }
        req.user = decoded; // Добавляем user в req
        next(); // Передаём управление дальше
    });
}
