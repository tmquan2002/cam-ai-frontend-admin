import { Shop } from "./Shop";

export interface EdgeBoxLocation {
    timestamp: string;
    id: number;
    name: string;
    description: string;
}

export interface EdgeBoxStatus {
    timestamp: string;
    id: number;
    name: string;
    description: string;
}

// TODO: Redesign when BE is done with structures and fully run well
export interface EdgeBox {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    username: string;
    password: string;
    name: string;
    version: string;
    edgeBoxModelId: string;
    edgeBoxStatus: string;
    edgeBoxLocation: string;
    edgeBoxModel: EdgeBoxModel;
    installs: EdgeBoxInstall[];
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
    validFrom: string;
    validUntil: string;
    edgeBox: EdgeBox;
    shop: Shop;
    edgeBoxInstallStatus: string;
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