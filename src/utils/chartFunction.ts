import { DonutChartCell } from "@mantine/charts";
import { CommonResponse } from "../models/CommonResponse";
import { ReportEdgeBox, ReportEdgeBoxInstall } from "../models/Report";
import { DashBoardChartSortBy, EdgeBoxActivationStatus, EdgeBoxInstallStatus, EdgeBoxLocationStatus, EdgeBoxStatus } from "../types/enum";
import { removeTime } from "./dateTimeFunction";
import { getColorFromStatusName } from "./helperFunction";

interface DataWithDate {
    createdDate: string;
    [key: string]: any;
}

interface CountDate {
    Date: string;
    DateToShow: string;
    Total: number;
}

export function countDataByDate(data: CommonResponse<DataWithDate> | undefined, sortBy?: string | null) {
    const countByDate: CountDate[] = [];
    data?.values.forEach(obj => {
        const date = removeTime(new Date(obj.createdDate), "/")
        const index = countByDate.findIndex(item => item.DateToShow == date)
        if (index != -1) {
            countByDate[index] = { Date: obj.createdDate, DateToShow: date, Total: countByDate[index].Total + 1 }
        } else {
            countByDate.push({ Date: obj.createdDate, DateToShow: date, Total: 1 })
        }
    });

    if (sortBy == DashBoardChartSortBy.Daily) {
        return countByDate.sort((a, b) => {
            const dateA = new Date(a.Date);
            const dateB = new Date(b.Date);
            return dateB.getTime() - dateA.getTime();
        });
    }
    if (sortBy == DashBoardChartSortBy.Cumulative) {
        return countByDate.sort((a, b) => {
            return a.Total - b.Total;
        });
    }
    return countByDate;
}

export function convertReportResponseToChartFormat(
    dataEdgeBox?: ReportEdgeBox, dataInstall?: ReportEdgeBoxInstall,
    type?: "edgeBoxStatus" | "activationStatus" | "locationStatus" | "installationStatus"
): DonutChartCell[] {

    if (dataEdgeBox) {
        if (type == "edgeBoxStatus")
            return Object.keys(dataEdgeBox.status).map((key) => ({
                name: key,
                value: (key == EdgeBoxStatus.Active || key == EdgeBoxStatus.Inactive || key == EdgeBoxStatus.Disposed || key == EdgeBoxStatus.Broken) ? dataEdgeBox.status[key] : 0,
                color: getColorFromStatusName(key, true),
            }))
        if (type == "locationStatus")
            return Object.keys(dataEdgeBox.location).map((key) => ({
                name: key,
                value: (key == EdgeBoxLocationStatus.Idle || key == EdgeBoxLocationStatus.Installing || key == EdgeBoxLocationStatus.Occupied || key == EdgeBoxLocationStatus.Uninstalling) ? dataEdgeBox.location[key] : 0,
                color: getColorFromStatusName(key, true),
            }))
    }

    if (dataInstall) {
        if (type == "installationStatus")
            return Object.keys(dataInstall.status).map((key) => ({
                name: key,
                value: (key == EdgeBoxInstallStatus.Disabled || key == EdgeBoxInstallStatus.Working || key == EdgeBoxInstallStatus.Unhealthy || key == EdgeBoxInstallStatus.New) ? dataInstall.status[key] : 0,
                color: getColorFromStatusName(key, true),
            }))
        if (type == "activationStatus")
            return Object.keys(dataInstall.activationStatus).map((key) => ({
                name: key,
                value: (key == EdgeBoxActivationStatus.Activated || key == EdgeBoxActivationStatus.Failed || key == EdgeBoxActivationStatus.NotActivated || key == EdgeBoxActivationStatus.Pending) ? dataInstall.activationStatus[key] : 0,
                color: getColorFromStatusName(key, true),
            }))
    }

    return [];
}