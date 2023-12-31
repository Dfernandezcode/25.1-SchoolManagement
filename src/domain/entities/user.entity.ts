// IMPORTS
import { Document, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { Classroom, IClassroom } from "./classroom.entity";

export enum ROLE {
  "STUDENT" = "STUDENT",
  "TEACHER" = "TEACHER",
  "PARENT" = "PARENT",
  "ADMIN" = "ADMIN",
}

// user model:
export interface IUserCreate {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // What if user is not student?:
  classroom?: IClassroom;
  children?: IUser[];
  role: ROLE;
}

export type IUser = IUserCreate & Document;

const userSchema = new Schema<IUserCreate>(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: (text: string) => validator.isEmail(text),
        message: "Email incorecto",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: 8,
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: Classroom,
      required: false,
    },
    children: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ROLE,
    },
  },
  // What if user is not student?:
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    // Si la contraseña ya estaba encriptada, no la encriptamos de nuevo
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }
    next();
  } catch (error: any) {
    next(error);
  }
});
export const User = model<IUserCreate>("User", userSchema);
