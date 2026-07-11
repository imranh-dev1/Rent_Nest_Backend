import { Router, raw } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = Router();


router.post("/create", auth(Role.TENANT), validateRequest(paymentValidation.createPaymentSchema), paymentController.createPayment);

router.post("/webhook", paymentController.handleWebhook);

// router.get("/", auth(Role.TENANT), paymentController.getMyPayments);

// router.get("/:id", auth(Role.TENANT), paymentController.getPaymentById);

export const paymentRoute = router;