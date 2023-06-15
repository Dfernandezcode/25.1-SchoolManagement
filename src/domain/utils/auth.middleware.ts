import { Request, NextFunction, Response } from "express";
import { verifyToken } from "./token";
import { User } from "../entities/user.entity";

export const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<null> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    // Descodificamos el token
    const decodedInfo = verifyToken(token);
    const user = await User.findOne({ email: decodedInfo.userEmail }).select("+password");
    if (!user) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    req.user = {
      id: user.id,
      // TS trick - to change type you can pass one type to an unknown and then pass that into new type.
      role: user.role as unknown as CUSTOM_ROLE,
    };
    next();

    return null;
  } catch (error) {
    res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    return null;
  }
};

module.exports = { isAuth };
