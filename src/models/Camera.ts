import { EdgeBoxInstall } from "./EdgeBox";

export interface Camera {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    shopId: string;
    edgeBoxId: string;
    shop: string;
    edgeBoxInstall: EdgeBoxInstall;
}