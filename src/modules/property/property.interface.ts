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
}

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
}