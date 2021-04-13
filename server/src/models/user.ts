import { Document, Model, model, Schema } from "mongoose"
import * as crypto from "crypto"
import { User } from "./../types/user"

// https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1

// This interface is private to the user model - don't export it
interface UserDocument extends User, Document {
    _password: string;
    salt: string;
    authenticate(plainText: string): boolean;
    encryptPassword(plainText: string): string;
    makeSalt(): string;
}

export interface UserModel extends Model<UserDocument> {
    findUser(id: string): Promise<UserDocument>
}

// user schema
const UserSchema: Schema<UserDocument, UserModel> = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
        },
        hashed_password: {
            type: String,
            required: true,
        },
        salt: String,
        role: {
            type: String,
            default: 'subscriber'
        },
        resetPasswordLink: {
            data: String,
            default: ''
        },
    }, {
        timestamps: true
    }
)

// virtual fields
UserSchema.virtual('password')
    .set(function(this: UserDocument, password: string){
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function(this: UserDocument): string {
        return this._password
    })

// helper object methods
UserSchema.methods.encryptPassword = function (this: UserDocument, plainText: string) {
    if (!plainText) return ''
    try {
        crypto.createHmac('sha1', this.salt)
            .update(plainText)
            .digest('hex');
    } catch (err) {
        return ''
    }
}

UserSchema.methods.makeSalt = function (): string {
    return Math.round(new Date().valueOf() * Math.random()) + ''
}

UserSchema.methods.authenticate = function (this: UserDocument, plainText: string): boolean {
    return this.encryptPassword(plainText) === this.hashed_password
}

// static methods
UserSchema.statics.findUser = async function (this: Model<UserDocument>, id: string) {
    return this.findById(id)
}

export default model<UserDocument, UserModel>("User", UserSchema)