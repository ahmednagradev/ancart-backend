import { Schema, Document, model } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    isActive: boolean;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    }, 
    {
        timestamps: true
    }
);

export default model<ICategory>("Category", categorySchema);