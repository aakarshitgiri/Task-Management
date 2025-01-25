import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
    userId: mongoose.Types.ObjectId;
    timestamp: Date;
    type: "Check-In" | "Check-Out";
}

const SessionSchema: Schema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        timestamp: { type: Date, default: Date.now },
        type: { type: String, enum: ["Check-In", "Check-Out"], required: true },
    },
    { timestamps: true }
);

export default mongoose.model<ISession>("Session", SessionSchema);
