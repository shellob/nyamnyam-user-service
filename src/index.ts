import express, { Request, Response } from "express";
import loginController from "./adapters/http/login.controller";
import registerController from "./adapters/http/register.controller";
import { authenticateJWT } from "./adapters/middleware/auth.middleware";

const app = express();
app.use(express.json());

// Подключаем контроллеры
app.use("/auth", loginController);
app.use("/auth", registerController);

// 🔹 Защищённый маршрут (профиль пользователя)
app.get("/me", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return
    }
    res.json({ message: "Welcome!", user: req.user });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
