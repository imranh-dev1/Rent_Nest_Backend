import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Category created successfully....",
        data: result
    });
});

const getAllCategory = asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategory();

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Categoris retrieved successfully....",
        data: result
    });
});

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const result = await categoryService.getCategoryById(categoryId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Category retrieved successfully....",
        data: result
    });
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const payload = req.body;
    const result = await categoryService.updateCategory(categoryId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Category updated successfully....",
        data: result
    });
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const result = await categoryService.deleteCategory(categoryId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Category deleted successfully....",
        data: result
    });
});

export const categoryController = {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}