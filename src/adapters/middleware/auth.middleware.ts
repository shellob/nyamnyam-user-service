import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { KafkaService } from "../kafka/kafka.service";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

declare module "express" {
    interface Request {
        user?: any;
    }
}

const kafkaService = new KafkaService();
kafkaService.connect();
// Middleware для проверки токена
export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        console.log("🔹 Отправляем токен в Kafka:", token);
        await kafkaService.sendMessage("jwt-validation", { token });

        // Ожидаем ответа от UserService
        await kafkaService.consumeMessages("jwt-validation-response", async (message) => {
            console.log("📩 Получили ответ от UserService:", message);
            
            if (!message.isValid) {
                return res.status(403).json({ message: "Forbidden: Invalid token" });
            }

            req.user = message.decoded; // Добавляем пользователя в req
            next(); // Передаём управление дальше
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}