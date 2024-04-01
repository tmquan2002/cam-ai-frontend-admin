import { RequestStatus, RequestType } from "../types/enum";
import { Account } from "./Account";
import { EdgeBox } from "./EdgeBox";
import { Shop } from "./Shop";

export type Request = {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    requestType: RequestType;
    accountId: string;
    shopId: string;
    edgeBoxId: string;
    detail: string;
    reply: string;
    requestStatus: RequestStatus;
    account: Account;
    shop: Shop;
    edgeBox: EdgeBox;
};