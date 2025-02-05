import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

export const validateToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    if (!token) {
        res.status(401).json({ valid: false, message: "Token is required" });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(403).json({ valid: false, message: "Invalid token" });
    }
};
