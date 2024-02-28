import { Brand } from "./Brand";
import { Ward } from "./Location";
import { Shop } from "./Shop";

export type Account = {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    email: string;
    name: string;
    gender: string;
    phone: string;
    birthday: string;
    wardId: string;
    addressLine: string;
    workingShopId: string;
    accountStatusId: number;
    ward: Ward;
    workingShop: Shop;
    accountStatus: string;
    brand: Brand;
    managingShop: Shop;
    role: string;
};