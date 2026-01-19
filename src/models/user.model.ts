import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
    fullname: string;
    email: string;
    passwordHash: string;
    status: "UNVERIFIED" | "ACTIVE";
    role: "USER" | "ADMIN";

    verificationCode?: string;
    verificationCodeExpiresAt?: Date;
}

const UserSchema = new Schema<IUser>(
    {
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["UNVERIFIED", "ACTIVE"],
            default: "UNVERIFIED",
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },

        verificationCode: {
            type: String,
        },
        verificationCodeExpiresAt: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

export default model<IUser>("User", UserSchema);