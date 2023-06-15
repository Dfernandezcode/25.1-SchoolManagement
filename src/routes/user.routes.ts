import express from "express";
import { isAuth } from "../domain/utils/auth.middleware";
import { userService } from "../domain/services/user.service";

// Router propio de usuarios
export const userRouter = express.Router();

userRouter.get("/", isAuth, userService.getUsers);
userRouter.get("/:id", isAuth, userService.getUserById);
userRouter.post("/", isAuth, userService.createUser);
userRouter.delete("/:id", isAuth, userService.deleteUser);
userRouter.put("/:id", isAuth, userService.updateUser);
userRouter.post("/login", userService.login);

// only for admin
