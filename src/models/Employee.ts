import { Behavior } from "./Behaviors";
import { Ward } from "./Location";
import { Shop } from "./Shop";

export interface EmployeeStatus {
    id: number;
    name: string;
    description: string;
}

export interface Employee {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    email: string;
    name: string;
    gender: number | string;
    phone: string;
    image: string;
    birthday: string;
    wardId: string;
    shopId: string;
    addressLine: string;
    employeeStatusId: number;
    ward: Ward;
    shop: Shop;
    employeeStatus: EmployeeStatus;
    behavior: Behavior;
};