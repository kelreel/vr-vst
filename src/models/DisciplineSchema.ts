import mongoose from "mongoose";

export type DisciplineDocument = mongoose.Document & {
  title: string;
  content: string;
  links: string[];
};

const DisciplineSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    categories: String,
    links: [String],
  },
  {
    timestamps: true,
  }
);

export const Discipline = mongoose.model<DisciplineDocument>("Discipline", DisciplineSchema);
