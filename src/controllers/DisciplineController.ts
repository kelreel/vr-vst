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
import { Discipline } from "../models/DisciplineSchema";

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

// Get all disciplines
router.get("/", async (req, res) => {
  try {
    const { id } = req.params;
    let disciplines = await Discipline.find();
    res.send(disciplines);
  } catch (error) {
    console.log(error);
  }
});

// Get discipline by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let discipline = await Discipline.findById(id);
    res.send(discipline);
  } catch (error) {
    console.log(error);
  }
});

// Add new discipline
router.post("/", isAuthMiddleware(UserRole.admin), async (req, res) => {
  try {
    const { data } = req.params;
    let discipline = new Discipline(data);
    await discipline.save();
    res.send(discipline);
  } catch (error) {
    console.log(error);
  }
});

// Edit discipline by id
router.put("/:id", isAuthMiddleware(UserRole.admin), async (req, res) => {
  try {
    const { data } = req.params;
    let discipline = await Discipline.findById(req.params.id);
    // @ts-ignore
    discipline = {...discipline, data}
    await discipline.save();
    res.send(discipline);
  } catch (error) {
    console.log(error);
  }
});

// Delete discipline by id
router.put("/:id", isAuthMiddleware(UserRole.admin), async (req, res) => {
  try {
    await Discipline.deleteOne({_id: req.params.id})
    res.send({success: 1});
  } catch (error) {
    console.log(error);
  }
});

export default router;
