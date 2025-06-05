import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "CLOSED"], default: "TODO" },
    priority: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    deadline: { type: Date },
    helpfulNotes: { type: String },
    relatedSkills: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Ticket", ticketSchema)