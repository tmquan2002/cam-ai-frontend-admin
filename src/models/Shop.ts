import { Brand } from "./Brand";
import { Camera } from "./Camera";
import { EdgeBoxInstall } from "./EdgeBox";
import { Ward } from "./Location";

export interface Shop {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    phone: string;
    wardId: string;
    addressLine: string;
    shopManagerId: string;
    brandId: string;
    shopStatusId: number;
    shopManager: string;
    ward: Ward;
    brand: Brand;
    shopStatus: string;
    employees: string[];
    cameras: Camera[];
    edgeBoxInstalls: EdgeBoxInstall[];
}
