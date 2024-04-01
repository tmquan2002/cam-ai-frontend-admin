import { AccountStatus, Gender } from "../types/enum";
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
    gender: Gender;
    phone: string;
    birthday: string;
    wardId: string;
    addressLine: string;
    workingShopId: string;
    accountStatusId: number;
    ward: Ward;
    workingShop: Shop;
    accountStatus: AccountStatus;
    brand: Brand;
    managingShop: Shop;
    role: string;
};