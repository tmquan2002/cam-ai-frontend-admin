import { EdgeBoxActivationStatus, EdgeBoxInstallStatus } from "../types/enum";
import { EdgeBox } from "./EdgeBox";
import { Shop } from "./Shop";

export interface EdgeBoxInstall {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    edgeBoxId: string;
    shopId: string;
    lastSeen: string;
    ipAddress: string;
    operatingSystem: string;
    uninstalledTime: string;
    edgeBox: EdgeBox;
    shop: Shop;
    edgeBoxInstallStatus: EdgeBoxInstallStatus;
    activationStatus: EdgeBoxActivationStatus;
    activationCode: string;
}