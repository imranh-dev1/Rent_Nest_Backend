import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), authController.getMe);
router.patch("/update-me", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), authController.updateMe);

// next 
// /logout
// /change-password
// /refresh-token

export const authRoute = router;