import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";

import { User, UserDocument, UserRole } from "../models/UserSchema";
import {
  DecodedUserTokenType,
  isAuthMiddleware,
} from "../services/AuthService";
import UserService from "../services/UserService";
import { HttpException } from "../utils/errorHandler";

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

router.get("/:id", isAuthMiddleware(), async (req, res) => {
  const { id } = req.params;
  let user: UserDocument = null;
  let initiator: DecodedUserTokenType = res.locals.user;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id);
    } else {
      user = await User.findOne({ login: id });
    }
    if (user === null) {
      throw new HttpException(404, "User not found");
    }

    if (user && initiator !== undefined && initiator.role === UserRole.admin) {
      res.send({
        _id: user._id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
      });
    } else {
      res.send({
        _id: user._id,
        login: user.login,
        createdAt: user.createdAt,
        role: user.role,
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create new user
router.post("/", async (req, res) => {
  const { login, password, email } = req.body;
  try {
    res.send(await UserService.createUser(login, password, email));
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login and get Auth token
router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    res.send(await UserService.loginUser(login, password));
  } catch (error) {
    res.status(400).send(error);
  }
});

// Edit user
router.put("/:id", isAuthMiddleware(), async (req, res) => {
  try {
    let initiator_user: DecodedUserTokenType = res.locals.user;
    const { data } = req.body;

    res.send(await UserService.editUser(initiator_user, data));
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get user profile
router.get("/profile", isAuthMiddleware(), async (req, res) => {
  try {
    // @ts-ignore
    let user = await User.findById(req.user._id);
    user.password = null;
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", isAuthMiddleware(), async (req, res) => {
  try {
    let user_token: DecodedUserTokenType = res.locals.user;
    let user = await User.findById(req.params.id);

    if (user._id === user_token._id) {
      // Delete user account from initiator user
      await User.deleteOne({ _id: user._id });
      res.send({ success: 1 });
      return;
    }

    if (user_token.role === UserRole.admin) {
      // Delete user from admin
      await User.deleteOne({ _id: req.params.id });
      res.send({ success: 1 });
      return;
    }

    throw new HttpException(401, "Not authorized for this action");
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
