export interface ICreateReview {
    rating: number;
    comment?: string;
}

export interface IUpdateReview {
    rating?: number;
    comment?: string;
}