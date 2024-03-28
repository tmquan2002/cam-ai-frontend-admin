export enum RoleEnum {
  Admin = "Admin",
  Technician = "Technician",
  BrandManager = "BrandManager",
  ShopManager = "ShopManager",
  Employee = "Employee",
}

export enum RoleEnumName {
  Admin = "Admin",
  Technician = "Technician",
  BrandManager = "BrandManager",
  ShopManager = "ShopManager",
  Employee = "Employee",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export enum AccountStatus {
  New = "New",
  Active = "Active",
  Inactive = "Inactive",
}

export enum BrandStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum ShopStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum NotificationStatus {
  Read = "Read",
  Unread = "Unread",
}

export enum EdgeBoxStatus {
  Active = "Active",
  Inactive = "Inactive",
  Broken = "Broken",
}

export enum EdgeBoxLocation {
  Idle = "Idle",
  Installing = "Installing",
  Occupied = "Occupied",
  Uninstalling = "Uninstalling",
  Disposed = "Disposed",
}

export enum EdgeBoxInstallStatus {
  Valid = "Valid",
  Expired = "Expired",
}

export enum RequestType {
  Install = "Install",
  Repair = "Repair",
  Remove = "Remove",
  Other = "Other"
}

export enum RequestStatus {
  Open = "Open",
  Canceled = "Canceled",
  Done = "Done",
  Rejected = "Rejected ",
}

export enum EmployeeStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum Zone {
  Cashier = "Cashier",
  Customer = "Customer",
}

export enum IncidenttType {
  Phone = "Phone",
  Uniform = "Uniform"
}

export enum IncidenttStatus {
  New = "New",
  Accepted = "Accepted",
  Rejected = "Rejected"
}

export enum EvidenceType {
  Image = "Image",
}

export enum EvidenceStatus {
  ToBeFetched = "ToBeFetched",
  Fetched = "Fetched",
  NotFound = "NotFound"
}

export enum CommonStatus {
  New = "New",
  Active = "Active",
  Inactive = "Inactive",

}

export enum StatusColor {
  ACTIVE = "#23a55a",
  INACTIVE = "#f23f43",
  NEW = "#f0b232",
  NONE = "#80848e"
}
