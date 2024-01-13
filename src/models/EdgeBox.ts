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

export interface EdgeBoxInstallStatus {
    timestamp: string;
    id: number;
    name: string;
    description: string;
}

export interface EdgeBox {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    username: string;
    password: string;
    model: string;
    version: string;
    edgeBoxStatusId: number;
    edgeBoxLocationId: number;
    edgeBoxLocation: EdgeBoxLocation;
    edgeBoxStatus: EdgeBoxStatus;
    installs: [string];
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
    edgeBoxInstallStatusId: number;
    edgeBox: EdgeBox;
    shop: string;
    edgeBoxInstallStatus: EdgeBoxInstallStatus;
    cameras: [string];
}