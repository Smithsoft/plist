export interface User extends UserInformation
{
    password: string;
    hashed_password: string;
    resetPasswordLink: string;
    salt: string
}

export interface UserInformation {
    name: string;
    email: string;
    role: string;
}