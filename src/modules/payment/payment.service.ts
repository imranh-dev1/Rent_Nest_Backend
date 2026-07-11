import status from 'http-status';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import { PaymentProvider, PaymentStatus, PropertyAvailability, RentalStatus } from '../../../generated/prisma/enums';
import config from '../../config';
import { ICreatePayment } from './payment.interface';
import { stripe } from '../../lib/stripe';
import Stripe from 'stripe';
import { handleCheckoutCompleted } from './payment.utils';

const createPayment = async (tenantId: string, payload: ICreatePayment) => {

    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: payload.rentalRequestId,
        },
        include: {
            property: true,
        },
    });

    if (!rentalRequest) {
        throw new AppError(status.NOT_FOUND, "Rental request not found.");
    };

    if (rentalRequest.tenantId !== tenantId) {
        throw new AppError(status.FORBIDDEN, "You are not allowed to pay for this rental request.");
    };

    if (rentalRequest.status !== RentalStatus.APPROVED) {
        throw new AppError(status.BAD_REQUEST, "Rental request has not been approved yet.");
    };

    const existingPayment = await prisma.payment.findUnique({
        where: {
            rentalRequestId: rentalRequest.id,
        },
    });

    if (existingPayment) {
        throw new AppError(status.BAD_REQUEST, "Payment already exists for this rental request.");
    };

    const totalAmount = rentalRequest.property.rentAmount * rentalRequest.leaseMonths;

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],

        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: rentalRequest.property.title,
                        description: `${rentalRequest.leaseMonths} month rental`,
                    },

                    unit_amount: Math.round(totalAmount * 100),
                },

                quantity: 1,
            },
        ],

        metadata: {
            rentalRequestId: rentalRequest.id,
            tenantId,
        },

        success_url: `${config.app_url}/payments/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${config.app_url}/payments/cancel`,
    });

    const payment = await prisma.payment.create({
        data: {
            tenantId,
            rentalRequestId: rentalRequest.id,
            amount: totalAmount,

            transactionId: session.id,

            provider: PaymentProvider.STRIPE,

            paymentMethod: "card",

            status: PaymentStatus.PENDING,
        },
    });

    return {
        checkoutUrl: session.url,
        payment,
    };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
    const endpoinetSecret = config.stripe_webhook_secret;
    try {
        const event = stripe.webhooks.constructEvent(payload, signature, endpoinetSecret);

        switch (event.type) {
            case "checkout.session.completed":

                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            default:
                console.log("Ignored:", event.type);
                break;
        }

    } catch (error) {
        console.error(error);
        throw error;
    }
};

// const getMyPayments = async (userId: string, role: string) => {
//     const where = role === 'ADMIN' ? {} : { rentalRequest: { tenantId: userId } };

//     return prisma.payment.findMany({
//         where,
//         include: {
//             rentalRequest: {
//                 include: {
//                     property: { select: { id: true, title: true, city: true } },
//                 },
//             },
//         },
//         orderBy: { createdAt: 'desc' },
//     });
// };

// const getPaymentById = async (paymentId: string, userId: string, role: string) => {
//     const payment = await prisma.payment.findUniqueOrThrow({
//         where: { id: paymentId },
//         include: {
//             rentalRequest: {
//                 include: {
//                     property: true,
//                     tenant: { select: { id: true, name: true, email: true } },
//                 },
//             },
//         },
//     });

//     if (role !== 'ADMIN' && payment.rentalRequest.tenantId !== userId) {
//         throw new AppError(status.FORBIDDEN, 'You do not have access to this payment.');
//     }

//     return payment;
// };

export const paymentService = {
    createPayment,
    handleWebhook,
    // getMyPayments,
    // getPaymentById,
};