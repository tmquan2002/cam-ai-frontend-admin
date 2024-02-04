export type Login = {
    username: string;
    password: string;
};

export type AuthToken = {
    accessToken: string;
    refreshToken: string;
}

export type Password = {
    oldPassword: string;
    newPassword: string;
    newPasswordRetype: string;
};