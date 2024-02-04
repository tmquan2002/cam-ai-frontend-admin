import { Brand } from "./Brand";
import { Ward } from "./Location";
import { Shop } from "./Shop";

export type AccountStatus = {
    timestamp: string;
    id: number;
    name: string;
    description: string;
}

export type AccountRole = {
    timestamp: string;
    id: number;
    name: string;
    description: string;
    accounts: string[];
}

export type Account = {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    email: string;
    name: string;
    gender: number;
    phone: string;
    birthday: string;
    wardId: string;
    addressLine: string;
    workingShopId: string;
    accountStatusId: number,
    ward: Ward;
    workingShop: Shop;
    accountStatus: AccountStatus;
    brand: Brand;
    managingShop: Shop;
    roles: AccountRole[];
};