export interface AccountStatus {
    timestamp: string;
    id: number;
    name: string;
    description: string;
}

export interface AccountRole {
    timestamp: string;
    id: number;
    name: string;
    description: string;
    accounts: string[];
}