import { Document } from "mongoose"

export interface User extends Document {
    name: string;
    email: string;
    hashed_password: string;
    role: string;
    resetPasswordLink: string;
}
