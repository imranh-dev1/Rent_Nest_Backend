import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/", auth(Role.ADMIN), validateRequest(categoryValidation.createCategorySchema), categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getCategoryById);
router.patch("/:id", auth(Role.ADMIN), validateRequest(categoryValidation.updateCategorySchema), categoryController.updateCategory);
router.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);


export const categoryRoute = router;