import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCategory, IUpdateCategory } from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
    const { name, description } = payload;

    const existingCategory = await prisma.category.findUnique({
        where: {
            name
        },
    });

    if (existingCategory) {
        throw new AppError(status.CONFLICT, "Category already exists.!");
    };

    const createdCategory = await prisma.category.create({
        data: {
            name,
            description
        },
    });

    return createdCategory;
}

const getAllCategory = async () => {
    const result = await prisma.category.findMany();
    return result;
};

const getCategoryById = async (categoryId: string) => {
    const category = await prisma.category.findUniqueOrThrow({
        where: {
            id: categoryId
        }
    });
    return category;
};

const updateCategory = async (categoryId: string, payload: IUpdateCategory) => {

    await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (payload.name) {
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                name: payload.name,
                NOT: {
                    id: categoryId,
                },
            },
        });

        if (duplicateCategory) {
            throw new AppError(status.CONFLICT, "Category name already exists.");
        };
    };

    // Update category
    const updatedCategory = await prisma.category.update({
        where: {
            id: categoryId,
        },
        data: payload,
    });

    return updatedCategory;
};

const deleteCategory = async (categoryId: string) => {
    const existingCategory = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });

    if (!existingCategory) {
        throw new AppError(status.NOT_FOUND, "Category not found.");
    }

    const propertyExists = await prisma.property.findFirst({
        where: {
            categoryId,
        },
    });

    if (propertyExists) {
        throw new AppError(status.CONFLICT, "Category cannot be deleted because it is assigned to one or more properties.");
    }

    await prisma.category.delete({
        where: {
            id: categoryId,
        },
    });

    return null;
};

export const categoryService = {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}