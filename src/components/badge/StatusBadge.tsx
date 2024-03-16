import { Badge } from "@mantine/core";
import { AccountStatus, BrandStatus, EdgeBoxStatus, RequestStatus, ShopStatus, StatusColor } from "../../types/enum";

interface BadgeParams {
    type: "account" | "shop" | "brand" | "edgebox" | "request";
    statusName: string;
    fullWidth?: boolean;
    mt?: number;
    mb?: number;
}

const StatusBadge = ({ type, statusName, fullWidth, mt, mb }: BadgeParams) => {
    if (type == "account") {
        return (
            <Badge size='lg' radius={"lg"} p={15} autoContrast fullWidth={fullWidth}
                color={statusName == AccountStatus.Active ? StatusColor.ACTIVE :
                    statusName == AccountStatus.Inactive ? StatusColor.INACTIVE :
                        statusName == AccountStatus.New ? StatusColor.NEW : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0}>
                {statusName || ""}
            </Badge>
        )
    } else if (type == "shop") {
        return (
            <Badge size='lg' radius={"lg"} p={15} autoContrast fullWidth={fullWidth}
                color={statusName == ShopStatus.Active ? StatusColor.ACTIVE :
                    statusName == ShopStatus.Inactive ? StatusColor.INACTIVE : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0}>
                {statusName || ""}
            </Badge>
        )
    } else if (type == "edgebox") {
        return (
            <Badge size='lg' radius={"lg"} p={15} autoContrast fullWidth={fullWidth}
                color={statusName == EdgeBoxStatus.Active ? StatusColor.ACTIVE :
                    statusName == EdgeBoxStatus.Inactive ? StatusColor.INACTIVE : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0}>
                {statusName || ""}
            </Badge>
        )
    } else if (type == "request") {
        return (
            <Badge size='lg' radius={"lg"} p={15} autoContrast fullWidth={fullWidth}
                color={statusName == RequestStatus.Open ? StatusColor.NEW :
                    statusName == RequestStatus.Canceled ? StatusColor.INACTIVE :
                        statusName == RequestStatus.Done ? StatusColor.ACTIVE :
                            statusName == RequestStatus.Rejected ? StatusColor.NONE : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0}>
                {statusName || ""}
            </Badge>
        )
    } else {
        return (
            <Badge size='lg' radius={"lg"} p={15} autoContrast fullWidth={fullWidth}
                color={statusName == BrandStatus.Active ? StatusColor.ACTIVE :
                    statusName == BrandStatus.Inactive ? StatusColor.INACTIVE : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0}>
                {statusName || ""}
            </Badge>
        )
    }
}

export default StatusBadge