export type ReportEdgeBox = {
    total: number;
    status: {
        Active: number,
        Inactive: number,
        Broken: number,
        Disposed: number,
    },
    location: {
        Idle: number,
        Installing: number,
        Occupied: number,
        Uninstalling: number,
    },
};

export type ReportEdgeBoxInstall = {
    total: number;
    status: { [key: string]: number },
    activationStatus: { [key: string]: number },
};