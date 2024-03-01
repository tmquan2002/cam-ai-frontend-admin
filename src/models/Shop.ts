import { Account } from "./Account";
import { Brand } from "./Brand";
import { Camera } from "./Camera";
import { EdgeBoxInstall } from "./EdgeBox";
import { Employee } from "./Employee";
import { Ward } from "./Location";

export interface Shop {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    openTime: string;
    closeTime: string;
    phone: string;
    wardId: string;
    addressLine: string;
    shopManagerId: string;
    brandId: string;
    shopManager: Account;
    ward: Ward;
    brand: Brand;
    shopStatus: string;
    employees: Employee[];
    cameras: Camera[];
    edgeBoxInstalls: EdgeBoxInstall[];
}
