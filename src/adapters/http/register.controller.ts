import express, {Request, Response} from "express"
import { PrismaUserRepository } from "../persistence/user.repository";
import { RegisterUser } from "../../core/usecases/registerUser.usecase"
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const userRepository = new PrismaUserRepository(prisma);
const registerUser = new RegisterUser(userRepository);

router.post("/register", async(req: Request, res: Response) => {
    try {
        const user = await registerUser.execute(req.body);

        res.status(201).json(user);
    } catch(error: any) {
        res.status(400).json({message: error.message});
    }
});

export default router;