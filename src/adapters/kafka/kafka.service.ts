import { Kafka, Consumer, Producer } from "kafkajs";

export class KafkaService {
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;

    constructor() {
        this.kafka = new Kafka({
            brokers: ["localhost:9092"], // Подключение к Kafka
        });

        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: "user-service" });
    }

    async connect() {
        await this.producer.connect();
        await this.consumer.connect();
        console.log("KafkaService подключен");
    }

    async sendMessage(topic: string, message: any) {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }

    async consumeMessages(topic: string, callback: (message: any) => void) {
        await this.consumer.subscribe({ topic, fromBeginning: true });

        await this.consumer.run({
            eachMessage: async ({ message }) => {
                const data = JSON.parse(message.value?.toString() || "{}");
                callback(data);
            },
        });
    }
}
