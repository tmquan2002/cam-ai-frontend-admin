export interface Ward {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    districtId: string;
    district: District;
}

export interface District {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    provinceId: string;
    province: Province;
    wards: [string];
}

export interface Province {
    timestamp: string;
    id: string;
    createdDate: string;
    modifiedDate: string;
    name: string;
    districts: [string];
}