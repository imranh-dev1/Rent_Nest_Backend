import z from "zod";
import { UserStatus } from "../../../generated/prisma/enums";

const updateUserStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid user ID."),
    }),

    body: z.object({
        status: z.nativeEnum(UserStatus),
    }),
});

export const adminValidation = {
    updateUserStatusSchema
}