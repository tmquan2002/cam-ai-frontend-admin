import { District, Province, Ward } from "../models/Location";
import http from "../utils/http";

export const LocationAPI = {
    getProvinces: async () => {
        const res = await http.get<Province[]>(`/api/locations/provinces`);
        return res.data;
    },
    getDistrictsByProvinceId: async (id: string | null) => {
        const res = await http.get<District[]>(`/api/locations/provinces/${id}/districts`);
        return res.data;
    },
    getWardsByDistrictId: async (id: string | null) => {
        const res = await http.get<Ward[]>(`/api/locations/districts/${id}/wards`);
        return res.data;
    },
}