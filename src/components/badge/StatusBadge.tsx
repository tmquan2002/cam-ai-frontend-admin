import { Badge, Tooltip } from "@mantine/core";
import { CommonStatus, EdgeBoxInstallStatus, EdgeBoxLocation, StatusColor } from "../../types/enum";

interface BadgeParams {
    statusName: string;
    fullWidth?: boolean;
    mt?: number;
    mb?: number;
    ml?: number;
    mr?: number;
    size?: string;
    padding?: number;
    tooltip?: string
}

const StatusBadge = ({ statusName, fullWidth, mt, mb, ml, mr, size, padding, tooltip }: BadgeParams) => {
    return (
        <Tooltip label={tooltip || "Status"} withArrow>
            <Badge size={size || "lg"} radius={"lg"} p={padding || 15} autoContrast fullWidth={fullWidth}
                color={statusName == CommonStatus.Active || statusName == EdgeBoxLocation.Idle || statusName == EdgeBoxInstallStatus.Working ? StatusColor.ACTIVE :
                    statusName == CommonStatus.Inactive || statusName == EdgeBoxLocation.Disposed || statusName == EdgeBoxInstallStatus.Unhealthy ? StatusColor.INACTIVE :
                        statusName == CommonStatus.New || statusName == EdgeBoxLocation.Occupied || statusName == EdgeBoxInstallStatus.New ? StatusColor.NEW : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0} ml={ml || 0} mr={mr || 0}>
                {statusName.replace(/([A-Z])/g, ' $1').trim() || ""}
            </Badge>
        </Tooltip>
    )
}

export default StatusBadge