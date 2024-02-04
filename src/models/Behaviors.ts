import { Camera } from "./Camera";
import { Employee } from "./Employee";
import { Evidence } from "./Evidences";

export interface BehaviorType {
    timestamp: string;
    id: number;
    name: string;
    description: string;
}

export interface Behavior {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    behaviorTypeId: number;
    behaviorType: BehaviorType;
    employee: Employee;
    camera: Camera;
    evidences: Evidence;

};