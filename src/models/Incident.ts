import { IncidentStatus, IncidentType } from "../types/enum";
import { EdgeBox } from "./EdgeBox";
import { Employee } from "./Employee";
import { Evidence } from "./Evidences";
import { Shop } from "./Shop";

export interface Incident {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    incidentType: IncidentType;
    time: string;
    edgeBoxId: string;
    status: IncidentStatus;
    shopId: string;
    employeeId: string;
    edgeBox: EdgeBox;
    shop: Shop;
    employee: Employee;
    evidences: Evidence[];
}