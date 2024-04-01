import { NotificationStatus } from "../types/enum";
import { Account } from "./Account";

export interface Notification {
    id: string;
    createdDate: string;
    modifiedDate: string;
    timestamp: string;
    title: string;
    content: string;
    sentBy: Account;
    status: NotificationStatus;
    sentTo: Account[];
}