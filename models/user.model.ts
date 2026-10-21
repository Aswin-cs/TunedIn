import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    email: string;
    username: string;
    name?: string;
    avatar?: string;
    createadAt: Date;
    createdAt?: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    createadAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: false
});

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);