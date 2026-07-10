import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { adminService } from "./admin.service";
import { Request, Response } from "express";
import { propertyService } from "../property/property.service";
import { rentalRequestsService } from "../rental/rental.service";

const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.getDashboardStats();

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Dashboard statistics retrieved successfully.",
        data: result,
    });
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers(req.query);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Users retrieved successfully.",
        meta: result.meta,
        data: result.data,
    });
});

const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userStatus = req.body.status;

    const result = await adminService.updateUserStatus(id as string, userStatus);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "User status updated successfully.",
        data: result,
    });
});

const getAllProperties = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await propertyService.getAllProperties(query);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Properties retrieved successfully....",
        data: result.data,
        meta: result.meta
    });
});

const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
    const propertyId = req.params.id;
    const result = await propertyService.getPropertyById(propertyId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Property retrieved successfully....",
        data: result
    });
});

const deleteProperty = asyncHandler(async (req: Request, res: Response) => {

    const result = await adminService.deleteProperty(req.params.id as string);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Property deleted successfully.",
        data: result,
    });
});

const getRentalRequests = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = req.user!.id;
    const result = await rentalRequestsService.getLandlordRentalRequests(landlordId);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Rental requests retrieved successfully....",
        data: result,
    });
});

export const adminController = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getPropertyById,
    getRentalRequests,
    deleteProperty
}