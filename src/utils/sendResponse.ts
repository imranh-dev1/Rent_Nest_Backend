import { Response } from "express";


export interface IMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    meta?: IMeta
};

export const sendResponse = <T>(res: Response, payload: TResponse<T>) => {
    const { statusCode, success, message, data, meta } = payload;

    res.status(statusCode).json({
        success,
        statusCode,
        message,
        data,
        meta,
    });
};