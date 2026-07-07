import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createProperty = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const landlordId = req.user?.id;
    const result = await propertyService.createProperty(payload, landlordId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Property create sucssesfully...",
        data: result
    })
});

export const propertyController = {
    createProperty
};