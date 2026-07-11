import Stripe from "stripe";
import AppError from "../../errors/AppError";
import status from "http-status";
import { prisma } from "../../lib/prisma";
import { PaymentStatus, PropertyAvailability, RentalStatus } from "../../../generated/prisma/enums";

export const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {

    const rentalRequestId = session.metadata?.rentalRequestId;

    if (!rentalRequestId) {
        throw new AppError(status.BAD_REQUEST, "Rental request ID not found in Stripe session metadata.");
    }

    const payment = await prisma.payment.findUnique({
        where: {
            rentalRequestId,
        },
        include: {
            rentalRequest: {
                include: {
                    property: true,
                },
            },
        },
    });

    if (!payment) {
        throw new AppError(status.NOT_FOUND, "Payment record not found.");
    };

    if (payment.status === PaymentStatus.COMPLETED) {
        return payment;
    }

    const result = await prisma.$transaction(async (tx) => {

        const updatedPayment = await tx.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: PaymentStatus.COMPLETED,
                paidAt: new Date(),
                transactionId: session.payment_intent as string,
            },
        });

        await tx.rentalRequest.update({
            where: {
                id: rentalRequestId,
            },
            data: {
                status: RentalStatus.ACTIVE,
            },
        });

        await tx.property.update({
            where: {
                id: payment.rentalRequest.propertyId,
            },
            data: {
                availability: PropertyAvailability.RENTED,
            },
        });

        return updatedPayment;
    });

    return result;
};