import { prisma } from "../../lib/prisma";
import { ICreateProperty } from "./property.interface";

const createProperty = async (payload: ICreateProperty, landlordId: string) => {

    await prisma.category.findUniqueOrThrow({
        where: {
            id: payload.categoryId,
        },
    });

    const property = await prisma.property.create({
        data: {
            ...payload,
            landlordId
        },
    });

    return property;
};

export const propertyService = {
    createProperty
};