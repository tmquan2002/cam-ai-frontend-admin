import { Account } from "./Account";

export interface NotificationStatus {
    id: number;
    name: string;
    description: string;
}

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