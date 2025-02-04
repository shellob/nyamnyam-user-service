import express from "express";
import loginController from "./adapters/http/login.controller";
import registerController from "./adapters/http/register.controller";
import { KafkaService } from "./adapters/kafka/kafka.service";
import { JWTConsumer } from "./adapters/kafka/jwt.consumer";

const app = express();
app.use(express.json());

// Подключаем контроллеры
app.use("/auth", loginController);
app.use("/auth", registerController);

// Инициализируем Kafka
const kafkaService = new KafkaService();
const jwtConsumer = new JWTConsumer(kafkaService);

async function start() {
    await kafkaService.connect();
    await jwtConsumer.start();
}

start();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`User Service running on http://localhost:${PORT}`);
});
