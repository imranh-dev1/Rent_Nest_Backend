import status from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import { PropertyAvailability, RentalStatus, Role, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const getDashboardStats = async () => {
    const [
        totalUsers,
        totalLandlords,
        totalTenants,
        totalProperties,
        availableProperties,
        rentedProperties,
        unavailableProperties,
        totalCategories,
        totalRentalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        cancelledRequests,

        totalReviews,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: {
                role: Role.LANDLORD,
            },
        }),
        prisma.user.count({
            where: {
                role: Role.TENANT,
            },
        }),

        // Properties
        prisma.property.count(),
        prisma.property.count({
            where: {
                availability: PropertyAvailability.AVAILABLE,
            },
        }),
        prisma.property.count({
            where: {
                availability: PropertyAvailability.RENTED,
            },
        }),
        prisma.property.count({
            where: {
                availability: PropertyAvailability.UNAVAILABLE,
            },
        }),

        // Categories
        prisma.category.count(),

        // Rental Requests
        prisma.rentalRequest.count(),
        prisma.rentalRequest.count({
            where: {
                status: RentalStatus.PENDING,
            },
        }),
        prisma.rentalRequest.count({
            where: {
                status: RentalStatus.APPROVED,
            },
        }),
        prisma.rentalRequest.count({
            where: {
                status: RentalStatus.REJECTED,
            },
        }),
        prisma.rentalRequest.count({
            where: {
                status: RentalStatus.CANCELLED,
            },
        }),

        // Reviews
        prisma.review.count(),
    ]);

    return {
        users: {
            totalUsers,
            totalLandlords,
            totalTenants,
        },

        properties: {
            totalProperties,
            availableProperties,
            rentedProperties,
            unavailableProperties,
        },

        categories: {
            totalCategories,
        },

        rentalRequests: {
            totalRentalRequests,
            pendingRequests,
            approvedRequests,
            rejectedRequests,
            cancelledRequests,
        },

        reviews: {
            totalReviews,
        },
    };
};

const getAllUsers = async (query: Record<string, any>) => {
    const { page = 1, limit = 10, searchTerm, role, status, sortBy = "createdAt", sortOrder = "desc", } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.UserWhereInput = {};

    if (searchTerm) {
        where.OR = [
            {
                name: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
            {
                email: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            },
        ];
    }

    if (role) {
        where.role = role;
    }

    if (status) {
        where.status = status;
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: {
                [sortBy]: sortOrder,
            },
            omit: {
                password: true
            }
        }),

        prisma.user.count({
            where,
        }),
    ]);

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: users,
    };
};

const updateUserStatus = async (userId: string, userStatus: UserStatus) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found.");
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: userStatus,
        },
        omit: {
            password: true
        }
    });

    return updatedUser;
};

const deleteProperty = async (propertyId: string) => {

    const existingProperty = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    await prisma.property.delete({
        where: {
            id: propertyId,
        },
    });

    return null;
};

export const adminService = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    deleteProperty
}