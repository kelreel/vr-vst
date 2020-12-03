import bodyParser from "body-parser";
import express from "express";

import { isAuthMiddleware, DecodedUserTokenType } from "../services/AuthService";
import { UserRole, User } from "../models/UserSchema";
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

// Update platform settings
router.post(
  "/settings",
  isAuthMiddleware(UserRole.admin),
  async (req, res) => {
    try {
      const { data } = req.body;
      await (await Settings.findOne()).updateOne(data);
      res.send({success: 1});
    } catch (error) {
      console.log(error)
      throw new HttpException(400, 'Settings data incorrect')
    }
  }
);

export default router;
