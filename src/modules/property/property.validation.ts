import { z } from "zod";

const createPropertySchema = z.object({
    body: z.object({
        title: z
            .string()
            .trim()
            .min(5, "Title must be at least 5 characters.")
            .max(100, "Title cannot exceed 100 characters."),

        description: z
            .string()
            .trim()
            .min(20, "Description must be at least 20 characters."),

        address: z
            .string()
            .trim()
            .min(5, "Address is required."),

        city: z
            .string()
            .trim()
            .min(2, "City is required."),

        rentAmount: z
            .number({
                error: "Rent amount must be a number.",
            })
            .positive("Rent amount must be greater than 0."),

        bedrooms: z
            .number({
                error: "Bedrooms must be a number.",
            })
            .int()
            .min(1, "At least 1 bedroom is required."),

        bathrooms: z
            .number({
                error: "Bathrooms must be a number.",
            })
            .int()
            .min(1, "At least 1 bathroom is required."),

        area: z
            .number({
                error: "Area must be a number.",
            })
            .positive("Area must be greater than 0."),

        amenities: z
            .array(z.string().trim())
            .min(1, "At least one amenity is required."),

        images: z
            .array(z.string().url("Each image must be a valid URL."))
            .min(1, "At least one image is required."),

        categoryId: z
            .string()
            .trim()
            .min(1, "Category is required."),
    }),
});

const updatePropertySchema = z.object({
    body: createPropertySchema.shape.body.partial().extend({
        availability: z.boolean().optional(),
    }),
});

export const propertyValidation = {
    createPropertySchema,
    updatePropertySchema,
};