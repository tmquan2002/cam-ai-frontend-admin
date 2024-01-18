export interface BrandStatus {
    timestamp: string;
    id: number;
    name: string;
    description: string;
}

export type Brand = {
    id: string;
    createdDate: string;
    modifiedDate: string;
    timestamp: string;
    name: string;
    email: string;
    phone: string;
    logoUri: string;
    bannerUri: string;
    brandManagerId: string;
    brandStatusId: number;
    brandManager: string;
    brandStatus: BrandStatus;
    shops: [string];
};