import bodyParser from "body-parser";
import express from "express";

import { Lesson } from "../models/LessonSchema";
import {
  isAuthMiddleware,
  DecodedUserTokenType,
} from "../services/AuthService";
import { UserRole, User } from "../models/UserSchema";
import { HttpException } from "../utils/errorHandler";
import { Solve } from "../models/SolveSchema";

const router = express.Router();

router.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "30kb",
  }),
  bodyParser.json({
    limit: "10kb",
  })
);

// Get user's solves for all tasks
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let solves = await Solve.find(
      { user: id, isRight: true },
      { _id: 1, task: 1, createdAt: 1 }
    ).populate("lesson", ["_id", "title"]);
    res.send(solves);
  } catch (error) {
    console.log(error);
  }
});

// Send solve for Lesoon
router.post("/send", isAuthMiddleware(UserRole.student), async (req, res) => {
  try {
    const { solve, lessonId } = req.body;
    const user: DecodedUserTokenType = res.locals.user;

    let lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) throw new HttpException(400, "Task not found");

    let s = new Solve({
      lesson: lesson._id,
      user: user._id,
      value: solve
    });

    await s.save()

    res.send(s);
  } catch (error) {
    console.log(error);
    throw error;
  }
});

export default router;
