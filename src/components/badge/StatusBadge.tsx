import { Badge } from "@mantine/core";
import { AccountStatus, BrandStatus, ShopStatus, StatusColor } from "../../types/enum";

interface BadgeParams {
    type: "account" | "shop" | "brand";
    statusId: number;
    statusName: string;
    fullWidth?: boolean;
    mt?: number;
    mb?: number;
}

const StatusBadge = ({ type, statusId, statusName, fullWidth, mt, mb }: BadgeParams) => {
    if (type == "account") {
        return (
            <Badge size='lg' radius={"lg"} p={15} autoContrast fullWidth={fullWidth}
                color={statusId == AccountStatus.Active ? StatusColor.ACTIVE :
                    statusId == AccountStatus.Inactive ? StatusColor.INACTIVE :
                        statusId == AccountStatus.New ? StatusColor.NEW : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0}>
                {statusName || ""}
            </Badge>
        )
    } else if (type == "shop") {
        return (
            <Badge size='lg' radius={"lg"} p={15} autoContrast fullWidth={fullWidth}
                color={statusId == ShopStatus.Active ? StatusColor.ACTIVE :
                    statusId == ShopStatus.Inactive ? StatusColor.INACTIVE : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0}>
                {statusName || ""}
            </Badge>
        )
    } else {
        return (
            <Badge size='lg' radius={"lg"} p={15} autoContrast fullWidth={fullWidth}
                color={statusId == BrandStatus.Active ? StatusColor.ACTIVE :
                    statusId == BrandStatus.Inactive ? StatusColor.INACTIVE : StatusColor.NONE}
                mt={mt || 0} mb={mb || 0}>
                {statusName || ""}
            </Badge>
        )
    }
}

export default StatusBadge