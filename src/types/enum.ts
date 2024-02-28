export enum RoleEnum {
  Admin = 1,
  Technician = 2,
  BrandManager = 3,
  ShopManager = 4,
  Employee = 5,
}

export enum RoleEnumName {
  Admin = "Admin",
  Technician = "Technician",
  BrandManager = "BrandManager",
  ShopManager = "ShopManager",
  Employee = "Employee",
}

export enum Gender {
  Male = 0,
  Female = 1,
}

export enum AccountStatus {
  New = 1,
  Active = 2,
  Inactive = 3,
}

export enum BrandStatus {
  Active = 1,
  Inactive = 2,
}

export enum ShopStatus {
  Active = 1,
  Inactive = 2,
}

export enum NotificationStatus {
  Read = 1,
  Unread = 2,
}

export enum EdgeBoxStatus {
  Active = 1,
  Inactive = 2,
  Broken = 3,
}

export enum EdgeBoxLocation {
  Idle = 1,
  Installing = 2,
  Occupied = 3,
  Uninstalling = 4,
  Disposed = 5,
}

export enum EmployeeStatus {
  Active = 1,
  Inactive = 2,
}

export enum StatusColor {
  ACTIVE = "#23a55a",
  INACTIVE = "#f23f43",
  NEW = "#f0b232",
  NONE = "#80848e"
}
