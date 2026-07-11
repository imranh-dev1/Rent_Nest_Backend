import { z } from "zod";
import { PaymentProvider } from "../../../generated/prisma/enums";

const createPaymentSchema = z.object({
    body: z.object({
        rentalRequestId: z
            .string()
            .uuid("Invalid rental request ID."),

        provider: z.nativeEnum(PaymentProvider),
    }),
});

const confirmPaymentSchema = z.object({
    body: z.object({
        transactionId: z
            .string()
            .min(1, "Transaction ID is required."),
    }),
});

const paymentIdSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid payment ID."),
    }),
});

export const paymentValidation = {
    createPaymentSchema,
    confirmPaymentSchema,
    paymentIdSchema,
};