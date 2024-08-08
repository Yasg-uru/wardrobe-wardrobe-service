import { Request } from "express";
  export interface RequestWithUser extends Request {
    user?: {
      username: string;
      email: string;
      id: string;
      isVerified: string;
      iat: number;
      exp: number;
    };
  }

