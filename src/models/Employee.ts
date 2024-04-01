import { EmployeeStatus, Gender } from "../types/enum";
import { Incident } from "./Incident";
import { Ward } from "./Location";
import { Shop } from "./Shop";

export interface Employee {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    email: string;
    name: string;
    gender: Gender;
    phone: string;
    image: string;
    birthday: string;
    wardId: string;
    shopId: string;
    addressLine: string;
    ward: Ward;
    shop: Shop;
    employeeStatus: EmployeeStatus;
    incidents: Incident;
};