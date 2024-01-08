import { TOKEN } from "../constants/LocalStorageItems";
import { AuthToken } from "../models/Auth";

export const storeToken = (user: AuthToken) => {
    localStorage.setItem(TOKEN, JSON.stringify(user));
};

export const getToken = (): AuthToken | null => {
    const data = localStorage.getItem(TOKEN);
    return data ? JSON.parse(data) as AuthToken : null;
};