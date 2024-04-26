import { getAccessToken } from "../context/AuthContext";
import { ReportEdgeBox, ReportEdgeBoxInstall } from "../models/Report";
import http from "../utils/http";

export const ReportAPI = {
    getEdgeBoxReport: async () => {
        const token = getAccessToken();
        const res = await http.get<ReportEdgeBox>(`/api/edgeboxes/report`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
    getEdgeBoxInstallReport: async () => {
        const token = getAccessToken();
        const res = await http.get<ReportEdgeBoxInstall>(`/api/edgeboxinstalls/report`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        });
        return res.data;
    },
}