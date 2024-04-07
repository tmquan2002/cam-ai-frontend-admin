import { Badge, Tooltip } from "@mantine/core";
import { ActiveStatusGroup, IdleStatusGroup, InactiveStatusGroup, MiddleStatusGroup, StatusColor } from "../../types/enum";

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
                color={Object.values(ActiveStatusGroup).includes(statusName as ActiveStatusGroup) ? StatusColor.ACTIVE :
                    Object.values(InactiveStatusGroup).includes(statusName as InactiveStatusGroup) ? StatusColor.INACTIVE :
                        Object.values(IdleStatusGroup).includes(statusName as IdleStatusGroup) ? StatusColor.IDLE :
                            Object.values(MiddleStatusGroup).includes(statusName as MiddleStatusGroup) ? StatusColor.MIDDLE : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0} ml={ml || 0} mr={mr || 0}>
                {statusName.replace(/([A-Z])/g, ' $1').trim() || ""}
            </Badge>
        </Tooltip>
    )
}

export default StatusBadge