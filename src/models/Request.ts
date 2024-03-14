import { Account } from "./Account";
import { EdgeBox } from "./EdgeBox";
import { Shop } from "./Shop";

export type Request = {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    requestType: string;
    accountId: string;
    shopId: string;
    edgeBoxId: string;
    detail: string;
    reply: string;
    requestStatus: string
    account: Account;
    shop: Shop;
    edgeBox: EdgeBox;
};