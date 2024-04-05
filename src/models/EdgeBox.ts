import { EdgeBoxActivationStatus, EdgeBoxInstallStatus, EdgeBoxLocationStatus, EdgeBoxStatus } from "../types/enum";
import { Shop } from "./Shop";

export interface EdgeBox {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    version: string;
    edgeBoxModelId: string;
    edgeBoxStatus: EdgeBoxStatus;
    edgeBoxLocation: EdgeBoxLocationStatus;
    edgeBoxModel: EdgeBoxModel;
}

export interface EdgeBoxInstall {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    edgeBoxId: string;
    shopId: string;
    ipAddress: string;
    port: number;
    uninstalledTime: string;
    edgeBox: EdgeBox;
    shop: Shop;
    edgeBoxInstallStatus: EdgeBoxInstallStatus;
    activationStatus: EdgeBoxActivationStatus;
    activationCode: string;
}

export interface EdgeBoxModel {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    description: string;
    modelCode: string;
    manufacturer: string;
    cpu: string;
    ram: string;
    storage: string;
    os: string;
    edgeBoxes: EdgeBox[];
}