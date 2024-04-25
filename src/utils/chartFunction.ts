export function statusTo(str: string, atEvery: number) {
    let result = '';
    for (let i = 0; i < str.length; i += atEvery) {
        result += str.substring(i, i + atEvery) + ' ';
    }
    // Remove the extra space at the end
    return result.trim();
}