import { PaymentProvider } from "../../../generated/prisma/enums";


export interface ICreatePayment {
    rentalRequestId: string;
    tenantId: string;
    amount: number;
    provider: PaymentProvider;
}