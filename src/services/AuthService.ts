import express from "express";
import * as jwt from "jsonwebtoken";

import config from "../config";
import { UserRole } from "../models/UserSchema";
import { HttpException } from "../utils/errorHandler";

export type DecodedUserTokenType = {
  _id?: string;
  login?: string;
  role?: string;
};

/**
 * Get JWT from Express request (Bearer token)
 * @param  {express.Request} req
 * @returns string
 */
export const getToken = (req: express.Request): string => {
  return req.headers.authorization.split(" ")[1];
};

/**
 * Generate JWT
 * @param  {string} _id
 * @param  {string} login
 * @param  {string} role
 * @returns string
 */
export const generateToken = (
  _id: string,
  login: string,
  role: string
): string => {
  const data = {
    _id,
    login,
    role,
  };
  return jwt.sign(data, config.tokenSecret, {
    expiresIn: config.tokenExpiration,
  });
};

/**
 * Decode JWT to get basic user data
 * @param  {string} token
 * @returns DecodedUserTokenType
 */
export const decodeToken = (token: string): DecodedUserTokenType => {
  return jwt.verify(token, config.tokenSecret) as DecodedUserTokenType;
};

/**
 * Express middleware for checking user auth and user role
 * @param  {UserRole} role
 */
export const isAuthMiddleware = (role?: UserRole) => {
  return function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      if (!req.headers.authorization && !role) {
        next()
        return
      }
      const token = getToken(req);
      const decodedToken = jwt.verify(
        token,
        config.tokenSecret,
        (err, decoded) => {
          req.user = decoded;
          if (err) throw new HttpException(401, `Auth error: ${err.message}`);
        }
      );

      if (
        role === UserRole.admin &&
        decodeToken(token).role !== UserRole.admin
      ) {
        throw new HttpException(401, "You do not have administrator rights");
      }

      if (role === UserRole.teacher &&
        decodeToken(token).role !== UserRole.teacher || UserRole.admin) {
          throw new HttpException(401, "You do not have teacher rights")
        }

      res.locals.user = decodeToken(token);
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send(error);
    }
  };
};
