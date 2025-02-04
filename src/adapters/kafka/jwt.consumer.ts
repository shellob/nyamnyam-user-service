import { KafkaService } from "./kafka.service";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

export class JWTConsumer {
    constructor(private kafkaService: KafkaService) {}

    async start() {
        console.log("📡 Слушаем запросы на проверку JWT...");

        await this.kafkaService.consumeMessages("jwt-validation", async (message) => {
            const { token } = message;

            try {
                console.log("🔍 Проверяем JWT:", token);
                const decoded = jwt.verify(token, SECRET_KEY);
                console.log("✅ JWT валиден:", decoded);

                // Отправляем ответ обратно в OrderService
                await this.kafkaService.sendMessage("jwt-validation-response", { token, isValid: true });
            } catch (error) {
                console.error("❌ JWT невалиден:", error);
                await this.kafkaService.sendMessage("jwt-validation-response", { token, isValid: false });
            }
        });
    }
}
