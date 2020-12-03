import mongoose, { Schema } from "mongoose";

export type SolveDocument = mongoose.Document & {
  lesson: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  value: string;
};

const solveSchema = new mongoose.Schema(
  {
    lesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    value: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true,
  }
);

export const Solve = mongoose.model<SolveDocument>("Solve", solveSchema);
