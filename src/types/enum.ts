//Main enum section
export enum Role {
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

export enum EdgeBoxLocationStatus {
  Idle = "Idle",
  Installing = "Installing",
  Occupied = "Occupied",
  Uninstalling = "Uninstalling",
  Disposed = "Disposed",
}

export enum EdgeBoxInstallStatus {
  Working = "Working",
  Unhealthy = "Unhealthy",
  Disabled = "Disabled",
  New = "New",
}

export enum EdgeBoxActivationStatus {
  NotActivated = "NotActivated",
  Activated = "Activated",
  Pending = "Pending",
  Failed = "Failed",
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

export enum IncidentType {
  Phone = "Phone",
  Uniform = "Uniform"
}

export enum IncidentStatus {
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

//Status badge section
export enum ActiveStatusGroup {
  Active = CommonStatus.Active,
  Working = EdgeBoxInstallStatus.Working,
  Activated = EdgeBoxActivationStatus.Activated,
}

export enum InactiveStatusGroup {
  Inactive = CommonStatus.Inactive,
  Disposed = EdgeBoxLocationStatus.Disposed,
  Disabled = EdgeBoxInstallStatus.Disabled,
}

export enum IdleStatusGroup {
  New = CommonStatus.New,
  Idle = EdgeBoxLocationStatus.Idle,
}

export enum MiddleStatusGroup {
  Occupied = EdgeBoxLocationStatus.Occupied,
}

export enum StatusColor {
  ACTIVE = "#23a55a",
  MIDDLE = "#465574",
  INACTIVE = "#f23f43",
  IDLE = "#f0b232",
  NONE = "#80848e"
}
