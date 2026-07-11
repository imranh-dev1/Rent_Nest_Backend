import status from "http-status";
import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";

const createPayment = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user!.id;

    const result = await paymentService.createPayment(tenantId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Payment checkout  session created successfully.",
        data: result,
    });
});

const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    console.log('MUST print true', Buffer.isBuffer(req.body));
    const payload = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    await paymentService.handleWebhook(payload, signature);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Webhook triggred sucsessfully.",
        data: null
    })

});

// const getMyPayments = asyncHandler(async (req: Request, res: Response) => {
//     const tenantId = req.user.id;

//     const result = await paymentService.getMyPayments(tenantId);

//     sendResponse(res, {
//         success: true,
//         statusCode: status.OK,
//         message: "Payments retrieved successfully.",
//         data: result,
//     });
// });

// const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
//     const tenantId = req.user.id;

//     const result = await paymentService.getPaymentById(
//         tenantId,
//         req.params.id
//     );

//     sendResponse(res, {
//         success: true,
//         statusCode: status.OK,
//         message: "Payment retrieved successfully.",
//         data: result,
//     });
// });

export const paymentController = {
    createPayment,
    handleWebhook,
    // getMyPayments,
    // getPaymentById,
};