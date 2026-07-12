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

    if (existingProperty.availability === PropertyAvailability.RENTED) {
        throw new AppError(status.BAD_REQUEST, "This property is currently rented and cannot be deleted.");
    }

    await prisma.property.delete({
        where: {
            id: propertyId,
        },
    });

    return null;
};

const getAllRentalRequests = async (query: Record<string, any>) => {
    const {
        page = 1,
        limit = 10,
        status,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.RentalRequestWhereInput = {};

    if (status) {
        where.status = status as RentalStatus;
    }

    const [requests, total] = await Promise.all([
        prisma.rentalRequest.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                property: {
                    include: {
                        landlord: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        }),

        prisma.rentalRequest.count({
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
        data: requests,
    };
};

const getRentalRequestById = async (id: string) => {
    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id,
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    profileImg: true,
                },
            },
            property: {
                include: {
                    landlord: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        },
                    },
                },
            },
        },
    });

    if (!rentalRequest) {
        throw new AppError(status.NOT_FOUND, "Rental request not found.");
    }

    return rentalRequest;
};

const getAllReviews = async (query: Record<string, any>) => {
    const {
        page = 1,
        limit = 10,
        rating,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.ReviewWhereInput = {};

    if (rating) {
        where.rating = Number(rating);
    }

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                property: {
                    select: {
                        id: true,
                        title: true,
                        city: true,
                        rentAmount: true,
                    },
                },
            },
        }),

        prisma.review.count({
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
        data: reviews,
    };
};

const deleteReview = async (reviewId: string) => {
    const review = await prisma.review.findUnique({
        where: {
            id: reviewId,
        },
    });

    if (!review) {
        throw new AppError(
            status.NOT_FOUND,
            "Review not found."
        );
    }

    const deletedReview = await prisma.review.delete({
        where: {
            id: reviewId,
        },
    });

    return deletedReview;
};

export const adminService = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    deleteProperty,
    getAllRentalRequests,
    getRentalRequestById,
    getAllReviews,
    deleteReview
}