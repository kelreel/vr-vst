import mongoose from "mongoose";

export type LessonDocument = mongoose.Document & {
  title: string;
  content: string;
  links: string[];
  discipline: mongoose.Types.ObjectId;
};

const LessonSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    categories: String,
    links: [String],
    discipline: { type: mongoose.Schema.Types.ObjectId, ref: "Discipline" },
  },
  {
    timestamps: true,
  }
);

export const Lesson = mongoose.model<LessonDocument>("Lesson", LessonSchema);
