import { Request, Response, NextFunction } from "express";
import Errorhandler from "../util/errorhandler.util";
import jwt from "jsonwebtoken";
import { JWT_Decoded } from "../types/Jwtdecoded";
import { RequestWithUser } from "../types/ReqwithUser";
export const isAuthenticated = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new Errorhandler(400, "please Login to continue"));
  }
//   console.log("this is a token :", token);

  const decoded = jwt.verify(token,  process.env.JWT_SECRET as string) as JWT_Decoded;
//   const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!decoded) {
    return next(new Errorhandler(400, "please login to continue"));
  }
  req.user = decoded ;
  next();
};
