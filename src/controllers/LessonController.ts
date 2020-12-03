import bodyParser from "body-parser";
import express from "express";

import {
  isAuthMiddleware,
  DecodedUserTokenType,
} from "../services/AuthService";
import { Lesson } from "../models/LessonSchema";
import { UserRole } from "../models/UserSchema";
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

// Get all lessons
router.get("/", async (req, res) => {
  try {
    let lessons = await Lesson.find(
      { _id: 1, title: '1' }
    );
    res.send(lessons);
  } catch (error) {
    throw error;
  }
});

// Get lesson by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) new HttpException(404, "Lesson not found");
    res.send(lesson)
  } catch (error) {
    throw error;
  }
});

// Get user solves for task by task id
router.get("/:id/solves", isAuthMiddleware(UserRole.student), async (req, res) => {
  try {
    const user: DecodedUserTokenType = res.locals.user;
    let solves = await Solve.find({ lesson: req.params.id, user: user._id });
    res.send(solves);
  } catch (error) {
    throw error;
  }
});

// Get solves from all users for this task
router.get("/:id/solves", async (req, res) => {
  try {
    const { id } = req.params;
    let solves = await Solve.find(
      { task: id, isRight: true },
      { _id: 1, user: 1, createdAt: 1 }
    ).populate("user", ["login", "email"]);
    res.send(solves);
  } catch (error) {
    console.log(error);
  }
});

// Add new lesson
router.post("/", isAuthMiddleware(UserRole.teacher), async (req, res) => {
  const {
    data
  } = req.body;

  try {
    const lesson = new Lesson(data);
    await lesson.save();
    res.send(lesson);
  } catch (error) {
    throw error;
  }
});

// Edit lesson by ID
router.put("/:id", isAuthMiddleware(UserRole.teacher), async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const lesson = Lesson.findById(id);
    if (!lesson) new HttpException(404, "Lesson not found");
    await Lesson.updateOne({ _id: id }, data);
    res.send(await Lesson.findById(id));
  } catch (error) {
    throw new HttpException(404, error);
  }
});

router.delete("/:id", isAuthMiddleware(UserRole.teacher), async (req, res) => {
  try {
    let user: DecodedUserTokenType = res.locals.user;

    if (user.role === UserRole.student) {
      throw new HttpException(401, "Not authorized for this action");
    }
    // Delete lesson
    await Lesson.deleteOne({ _id: req.params.id });
    res.send({ success: 1 });
    return;
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
