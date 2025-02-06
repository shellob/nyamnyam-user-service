import { UserRole } from "@prisma/client";

export interface RegisterUserDTO {
    name: string,
    email: string,
    password: string,
    role: UserRole,
    phoneNumber?: string
}