import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    dueDate?: Date;
    priority: "High" | "Medium" | "Low";
    status: boolean;
}

const TaskSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        dueDate: { type: Date },
        priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
        status: { type: Boolean, default: false }, // false = Incomplete, true = Complete
    },
    { timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
