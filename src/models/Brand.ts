import { BrandStatus } from "../types/enum";
import { Account } from "./Account";
import { Image } from "./Image";
import { Shop } from "./Shop";

export type Brand = {
    id: string;
    createdDate: string;
    modifiedDate: string;
    timestamp: string;
    name: string;
    email: string;
    phone: string;
    logoId: string;
    logo: Image;
    bannerId: string;
    banner: Image;
    brandManagerId: string;
    brandManager: Account;
    brandStatus: BrandStatus;
    accounts: Account[];
    shops: Shop[];
};