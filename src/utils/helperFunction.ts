import { ActiveStatusGroup, IdleStatusGroup, InactiveStatusGroup, InstallStatusChartColor, MiddleStatusGroup, StatusColor, StatusColorLight } from "../types/enum";

export function isEmpty(value: string | null | undefined) {
  return (
    value == null || (typeof value === "string" && value.trim().length === 0)
  );
}

//Credit: https://gist.github.com/hu2di/e80d99051529dbaa7252922baafd40e3
export function removeVietnameseTones(str: string) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  return str;
}

export function enumToSelect<T extends { [key: string]: string }>(value: T): { label: string; value: string }[] {
  const keys = Object.keys(value);
  return keys.map((key): { label: string; value: string } => {
    return {
      label: key,
      value: value[key],
    };
  });
}

export function enumToArray<T extends { [key: string]: string }>(value: T): string[] {
  return Object.keys(value);
}

/**
 * Add a space after amount of characters
 * @param str The string to add space
 * @param atEvery Number of characters between each spaces
 * @returns 
 */
export function addSpace(str: string, atEvery: number) {
  let result = '';
  for (let i = 0; i < str.length; i += atEvery) {
    result += str.substring(i, i + atEvery) + ' ';
  }
  // Remove the extra space at the end
  return result.trim();
}

export function getColorFromStatusName(statusName: string, light?: boolean, reportChartType?: boolean) {

  if (reportChartType)
    return InstallStatusChartColor[statusName as keyof typeof InstallStatusChartColor];

  if (light)
    return Object.values(ActiveStatusGroup).includes(statusName as ActiveStatusGroup) ? StatusColorLight.ACTIVE :
      Object.values(InactiveStatusGroup).includes(statusName as InactiveStatusGroup) ? StatusColorLight.INACTIVE :
        Object.values(IdleStatusGroup).includes(statusName as IdleStatusGroup) ? StatusColorLight.IDLE :
          Object.values(MiddleStatusGroup).includes(statusName as MiddleStatusGroup) ? StatusColorLight.MIDDLE : StatusColorLight.NONE

  return Object.values(ActiveStatusGroup).includes(statusName as ActiveStatusGroup) ? StatusColor.ACTIVE :
    Object.values(InactiveStatusGroup).includes(statusName as InactiveStatusGroup) ? StatusColor.INACTIVE :
      Object.values(IdleStatusGroup).includes(statusName as IdleStatusGroup) ? StatusColor.IDLE :
        Object.values(MiddleStatusGroup).includes(statusName as MiddleStatusGroup) ? StatusColor.MIDDLE : StatusColor.NONE
}