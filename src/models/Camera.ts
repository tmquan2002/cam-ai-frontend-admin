import { Shop } from "./Shop";

export interface Camera {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    shopId: string;
    shop: Shop[];
    zone: string[];
}