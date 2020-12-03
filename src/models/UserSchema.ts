import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
  login: string,
  email: string,
  password: string,
  role: UserRole,
  createdAt: Date,
  updatedAt: Date
};

export enum UserRole {
  admin = "admin",
  teacher = "teacher",
  student = "student",
}

const userSchema = new mongoose.Schema(
  {
    login: {
      type: String,
      index: true,
      unique: true,
      required: true
    },
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student"
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<UserDocument>("User", userSchema)
