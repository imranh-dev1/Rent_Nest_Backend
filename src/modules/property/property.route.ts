import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { propertyValidation } from "./property.validation";

const router = Router();

router.post("/", auth(Role.LANDLORD), validateRequest(propertyValidation.createPropertySchema), propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/my-properties", auth(Role.LANDLORD), propertyController.getMyProperties);
router.get("/:id", propertyController.getPropertyById);
router.patch("/:id", auth(Role.LANDLORD), validateRequest(propertyValidation.updatePropertySchema), propertyController.updateProperty);
router.delete("/:id", auth(Role.LANDLORD), propertyController.deleteProperty);
router.patch("/:id/availability", auth(Role.LANDLORD), validateRequest(propertyValidation.changeAvailabilitySchema), propertyController.changeAvailability);


export const propertyRoute = router;