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
  Disposed = "Disposed",
}

export enum EdgeBoxLocationStatus {
  Idle = "Idle",
  Installing = "Installing",
  Occupied = "Occupied",
  Uninstalling = "Uninstalling",
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

export enum EdgeBoxActivityType {
  EdgeBoxStatus = "EdgeBoxStatus",
  EdgeBoxLocation = "EdgeBoxLocation",
  EdgeBoxHealth = "EdgeBoxHealth",
  EdgeBoxActivation = "EdgeBoxActivation",
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

export enum DashBoardChartSortBy {
  Daily = "Daily",
  Cumulative = "Cumulative",
}

//Status badge section
export enum ActiveStatusGroup {
  Active = CommonStatus.Active,
  Working = EdgeBoxInstallStatus.Working,
  Activated = EdgeBoxActivationStatus.Activated,
  Installing = EdgeBoxLocationStatus.Installing,
}

export enum InactiveStatusGroup {
  Inactive = CommonStatus.Inactive,
  Failed = EdgeBoxActivationStatus.Failed,
  Unhealthy = EdgeBoxInstallStatus.Unhealthy,
}

export enum IdleStatusGroup {
  New = CommonStatus.New,
  Idle = EdgeBoxLocationStatus.Idle,
  Pending = EdgeBoxActivationStatus.Pending,
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

export enum StatusColorLight {
  ACTIVE = "#9DFF9E",
  MIDDLE = "#748dc0",
  INACTIVE = "#F08080",
  IDLE = "#E7E48C",
  NONE = "#c4cbda"
}
