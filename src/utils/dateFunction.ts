//DD-MM-YYYY
export function removeTime(date: Date, seperator: string, format?: "dd/MM/yyyy" | "yyyy/MM/dd") {
    if (format == "yyyy/MM/dd") {
        return date.getFullYear() + seperator
            + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + seperator
            + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
    }
    
    return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + seperator
        + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + seperator
        + date.getFullYear()
}

export function getDateFromSetYear(yearLength: number) {
    const today = new Date();
    return new Date(today.getFullYear() - yearLength, today.getMonth(), today.getDate());
}

export function timeSince(date: Date) {

    var seconds = Math.floor(((new Date().getTime()) - date.getTime()) / 1000);

    var interval = seconds / 31536000;

    if (interval >= 1) {
        return Math.floor(interval) > 1 ? Math.floor(interval) + " years ago" : Math.floor(interval) + " year ago";
    }
    interval = seconds / 2592000;
    if (interval >= 1) {
        return Math.floor(interval) > 1 ? Math.floor(interval) + " months ago" : Math.floor(interval) + " month ago";
    }
    interval = seconds / 86400;
    if (interval >= 1) {
        return Math.floor(interval) > 1 ? Math.floor(interval) + " days ago" : Math.floor(interval) + " day ago";
    }
    interval = seconds / 3600;
    if (interval >= 1) {
        return Math.floor(interval) > 1 ? Math.floor(interval) + " hours ago" : Math.floor(interval) + " hour ago";
    }
    interval = seconds / 60;
    if (interval >= 1) {
        return Math.floor(interval) > 1 ? Math.floor(interval) + " minutes ago" : Math.floor(interval) + " minute ago";
    }
    return Math.floor(interval) == 1 ? Math.floor(interval) + " second ago" : Math.floor(interval) + " seconds ago";
}