import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export class RefreshTokenController {
    async refreshToken(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({ message: "Refresh token is required" });
            }

            let decoded: JwtPayload;
            try {
                decoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload;
            } catch (err) {
                return res.status(401).json({ message: "Invalid refresh token" });
            }

            if (!decoded.id) {
                return res.status(401).json({ message: "Invalid token payload" });
            }

            const newAccessToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            return res.status(200).json({ accessToken: newAccessToken });

        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
