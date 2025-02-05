import express from "express";
import loginController from "./adapters/http/login.controller";
import registerController from "./adapters/http/register.controller";
import { validateToken } from "./adapters/http/validate.controller";
import { authenticateJWT } from "./adapters/middleware/auth.middleware";

const app = express();
app.use(express.json());

// Подключаем контроллеры
app.use("/auth", loginController);
app.use("/auth", registerController);
app.post("/auth/validate", validateToken);

// Пример защищённого маршрута
app.get("/protected", authenticateJWT, (req, res) => {
    res.json({ message: "Ты авторизован!", user: req.user });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`User Service running on http://localhost:${PORT}`);
});
