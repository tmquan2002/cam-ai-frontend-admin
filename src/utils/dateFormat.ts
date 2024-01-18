export function getMonthShortName(date: Date) {
    //Ex: Oct Nov ...
    return date.toLocaleString("en-US", { month: "short" });
}

export function getMonthShortNameString(date: string) {
    //Ex: Oct Nov ...
    return new Date(date).toLocaleString("en-US", { month: "short" });
}

export function getMonthShortNameYearString(date: string) {
    //Ex: Jan 2023
    const result = new Date(date).toLocaleString("en-US", { month: "short" }) + " " + new Date(date).getFullYear()
    return result;
}

export function getMonthShortNameYearDate(date: Date) {
    //Ex: Jan 2023
    return date.toLocaleString("en-US", { month: "short" }) + " " + date.getFullYear()
}

export function getDateMonthString(date: string) {
    //Ex: 20/12
    return (new Date(date).getDate()) + "/" + (new Date(date).getMonth() + 1)
    //Month counts from 0
}

export function getDateMonthDate(date: Date) {
    //Ex: 20/12
    return date.getDate() + "/" + (date.getMonth() + 1)
    //Month counts from 0
}

export function getMonthsAndYearsLabelBar(startDate: string, endDate: string) {
    //Ex: [Jan 2023, Feb 2023, Mar 2023]
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate.getMonth() <= (new Date(endDate)).getMonth()) {
        dateArray.push(getMonthShortNameYearDate(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return dateArray;
}

export function splitDateRangeInMonths(lowerDate: Date, upperDate: Date): { lowerDate: string, upperDate: string }[] {
    const dateChunks: { lowerDate: string, upperDate: string }[] = [];

    let currentMonthStart = new Date(lowerDate);

    while (currentMonthStart <= upperDate) {
        const year = currentMonthStart.getFullYear();
        const month = currentMonthStart.getMonth();
        const nextMonthStart = new Date(year, month + 1, 1);

        if (nextMonthStart <= upperDate) {
            dateChunks.push({ lowerDate: currentMonthStart.toISOString(), upperDate: nextMonthStart.toISOString() });
        } else {
            dateChunks.push({ lowerDate: currentMonthStart.toISOString(), upperDate: upperDate.toISOString() });
        }

        // Set the start of the next month
        currentMonthStart = new Date(year, month + 1, 1);
    }

    // If the upperDate doesn't align perfectly with a 7-day range, add the remaining days as a chunk
    if (currentMonthStart < upperDate) {
        dateChunks.push({ lowerDate: currentMonthStart.toISOString(), upperDate: upperDate.toISOString() });
    }

    return dateChunks;
}

export function splitDateRangeInWeeks(lowerDate: Date, upperDate: Date): { lowerDate: string, upperDate: string }[] {
    const dateChunks: { lowerDate: string, upperDate: string }[] = [];

    let currentMonday = new Date(lowerDate);

    //Find the next Monday after lowerDate or itself
    while (currentMonday.getDay() !== 1) {
        currentMonday.setDate(currentMonday.getDate() + 1);
    }

    //Push the first chunk starting from lowerDate if itself is not Monday
    if (lowerDate.getDay() !== 1) {
        dateChunks.push({
            lowerDate: lowerDate.toISOString(),
            upperDate: currentMonday.toISOString()
        });
    }

    while (currentMonday < upperDate) {
        const nextMonday = new Date(currentMonday);
        nextMonday.setDate(nextMonday.getDate() + 7);
        if (nextMonday > upperDate) {
            nextMonday.setDate(upperDate.getDate() + 1);
        }
        dateChunks.push({
            lowerDate: currentMonday.toISOString(),
            upperDate: nextMonday.toISOString()
        });
        currentMonday = nextMonday;
    }

    return dateChunks;
}

export function getWeekLabelBar(lowerDate: Date, upperDate: Date): string[] {
    const rangeLabels: string[] = [];

    let currentMonday = new Date(lowerDate);

    //Find the next Monday after lowerDate or itself
    while (currentMonday.getDay() !== 1) {
        currentMonday.setDate(currentMonday.getDate() + 1);
    }

    //Push the first chunk starting from lowerDate if itself is not Monday
    if (lowerDate.getDay() !== 1) {
        rangeLabels.push(getDateMonthDate(lowerDate) + " - " + getDateMonthDate(currentMonday));
    }

    while (currentMonday < upperDate) {
        const nextMonday = new Date(currentMonday);
        nextMonday.setDate(nextMonday.getDate() + 7);
        if (nextMonday.getFullYear() >= upperDate.getFullYear() && nextMonday.getMonth() >= upperDate.getMonth() && nextMonday.getDate() >= upperDate.getDate()) {
            rangeLabels.push(getDateMonthDate(currentMonday) + " - " + getDateMonthDate(upperDate));
            break;
        } else {
            rangeLabels.push(getDateMonthDate(currentMonday) + " - " + getDateMonthDate(nextMonday));
        }
        currentMonday = new Date(nextMonday);
    }

    return rangeLabels;
}

//DD-MM-YYYY
export function removeTime(date: Date, seperator: string) {
    return date.getFullYear() + seperator
        + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + seperator
        + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
}

export function addOneMonthToDate(inputDate: string) {
    // Clone the input date to avoid modifying the original date
    const date = new Date(inputDate);

    // Increment the month value by 3
    date.setMonth(date.getMonth() + 3);

    // Handle the case where the result goes beyond December of the current year
    if (date.getMonth() !== (new Date(inputDate).getMonth() + 3) % 12) {
        // Increment the year by 1
        date.setFullYear(date.getFullYear() + 1);
    }

    return date.toISOString();
}

export function getDateFromSetYear(yearLength: number) {
    const today = new Date();
    return new Date(today.getFullYear() - yearLength, today.getMonth(), today.getDate());
}