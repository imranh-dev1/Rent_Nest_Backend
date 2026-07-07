export interface ICreateProperty {
    title: string;
    description: string;
    address: string;
    city: string;
    rentAmount: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    amenities: string[];
    images: string[];
    categoryId: string;
};

export interface IUpdateProperty {
    title?: string;
    description?: string;
    address?: string;
    city?: string;
    rentAmount?: number;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    amenities?: string[];
    images?: string[];
    availability?: boolean;
    categoryId?: string;
};

export interface IPropertyQuery {
    page?: number;
    limit?: number;

    search?: string;

    categoryId?: string;

    city?: string;

    minPrice?: number;
    maxPrice?: number;

    availability?: boolean;

    sortBy?: string;
    sortOrder?: "asc" | "desc";
}