export enum CommonConstant {
  IS_ALREADY_FETCHING_ACCESS = "isAlreadyFetchingAccessToken",
  SESSION = "session",
  USER_ACCESS_TOKEN = "user_access_token",
  USER_REFRESH_TOKEN = "user_refresh_token",
}

export enum BrandFilterProps {
  FILTER = "brandFilter",
  PAGE_INDEX = "pageIndex",
  SIZE = "size",
  SEARCH = "searchTerm",
  FILTER_STATUS = "filterStatus",
}

export enum AccountFilterProps {
  FILTER = "accountFilter",
  PAGE_INDEX = "pageIndex",
  SIZE = "size",
  SEARCH = "searchTerm",
  SEARCH_BY = "searchBy",
  FILTER_STATUS = "filterStatus",
  FILTER_ROLE = "filterRole",
  FILTER_SEARCH_BRAND = "filterSearchBrand",
  FILTER_SEARCH_BRAND_ID = "filterSearchBrandId",
}

export enum ShopFilterProps {
  FILTER = "shopFilter",
  PAGE_INDEX = "pageIndex",
  SIZE = "size",
  SEARCH = "searchTerm",
  SEARCH_BY = "searchBy",
  FILTER_STATUS = "filterStatus",
  FILTER_SEARCH_BRAND = "filterSearchBrand",
  FILTER_SEARCH_BRAND_ID = "filterSearchBrandId",
}

export enum EdgeBoxFilterProps {
  FILTER = "edgeBoxFilter",
  PAGE_INDEX = "pageIndex",
  SIZE = "size",
  SEARCH = "searchTerm",
  FILTER_STATUS = "filterStatus",
  FILTER_LOCATION = "filterLocation",
  FILTER_SEARCH_BRAND = "filterSearchBrand",
  FILTER_SEARCH_BRAND_ID = "filterSearchBrandId",
  FILTER_SEARCH_SHOP = "filterSearchShop",
  FILTER_SEARCH_SHOP_ID = "filterSearchShopId",
}

export enum EdgeBoxInstallFilterProps {
  FILTER = "edgeBoxInstallFilter",
  PAGE_INDEX = "pageIndex",
  SIZE = "size",
  FILTER_INSTALL_STATUS = "filterInstallStatus",
  FILTER_ACTIVATION_STATUS = "filterActivationStatus",
  FILTER_SEARCH_SHOP = "filterSearchShop",
  FILTER_SEARCH_SHOP_ID = "filterSearchShopId",
}

export enum DisabledEdgeBoxInstallFilterProps {
  FILTER = "disabledEdgeBoxInstallFilter",
  PAGE_INDEX = "pageIndex",
  SIZE = "size",
  FILTER_ACTIVATION_STATUS = "filterActivationStatus",
  FILTER_SEARCH_SHOP = "filterSearchShop",
  FILTER_SEARCH_SHOP_ID = "filterSearchShopId",
}

export enum NotificationColorPalette {
  IN_PROGRESS = "#9B59B6",
  DRAFT = "#34495E",
  REPORT_EXPENSES = "#54A0FF",
  UP_COMING = "#30CB83",
  UNAPPROVED = "#F1C40F",
  SEND_BACK = "#B33771",
  ALERT_MESSAGE = "#E74C3C",
  WARNING = "#F39C12",
  DEVIATIONS = "#D35400",
}

export const pageSizeSelect = ['5', '10', '15', '20']

export const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g;
export const emailRegex = /^\S+@(\S+\.)+\S{2,4}$/g;
export const urlRegex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
