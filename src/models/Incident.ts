import { Employee } from "./Employee";
import { Evidence } from "./Evidences";

export interface Incident {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    incidentType: string | number;
    time: string;
    employees: Employee[];
    evidences: Evidence[];
}