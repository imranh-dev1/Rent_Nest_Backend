import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidation } from "./admin.validation";


const router = Router();

router.get("/dashboard", auth(Role.ADMIN), adminController.getDashboardStats);
router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch("/users/:id/status", auth(Role.ADMIN), validateRequest(adminValidation.updateUserStatusSchema), adminController.updateUserStatus);
router.get("/properties", auth(Role.ADMIN), adminController.getAllProperties);
router.get("/properties/:id", auth(Role.ADMIN), adminController.getPropertyById);
router.delete("/properties/:id", auth(Role.ADMIN), adminController.deleteProperty);
router.get("/rental-requests", auth(Role.ADMIN), adminController.getAllRentalRequests);
router.get("/rental-requests/:id", auth(Role.ADMIN), adminController.getRentalRequestById);
router.get("/reviews", auth(Role.ADMIN), adminController.getAllReviews);
router.delete("/reviews/:id", auth(Role.ADMIN), adminController.deleteReview);




export const adminRoute = router;