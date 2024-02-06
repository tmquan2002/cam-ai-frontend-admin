export interface ActionType {
    actionType: 'Phone' | 'Laptop' | 'Idle';
    count: number;
}

export interface ShopCount {
    time: string;
    results: ActionType[];
    total: number;
    shopId: string;
}