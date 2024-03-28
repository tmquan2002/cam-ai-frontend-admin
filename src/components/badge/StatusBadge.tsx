import { Badge } from "@mantine/core";
import { CommonStatus, StatusColor } from "../../types/enum";

interface BadgeParams {
    statusName: string;
    fullWidth?: boolean;
    mt?: number;
    mb?: number;
    size?: string;
    padding?: number
}

const StatusBadge = ({ statusName, fullWidth, mt, mb, size, padding }: BadgeParams) => {
    return (
        <Badge size={size || "lg"} radius={"lg"} p={padding || 15} autoContrast fullWidth={fullWidth}
            color={statusName == CommonStatus.Active ? StatusColor.ACTIVE :
                statusName == CommonStatus.Inactive ? StatusColor.INACTIVE :
                    statusName == CommonStatus.New ? StatusColor.NEW : StatusColor.NONE}
            mt={mt || 0} mb={mb || 0}>
            {statusName || ""}
        </Badge>
    )
}

export default StatusBadge