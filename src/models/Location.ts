export interface Ward {
    id: number;
    name: string;
    districtId: string;
    district: District;
}

export interface District {
    id: number;
    name: string;
    provinceId: string;
    province: Province;
}

export interface Province {
    id: number;
    name: string;
}