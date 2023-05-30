import { db } from "@/database";
import { User } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { jwt, validations } from "@/utils";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return registerUser(req, res);
    default:
      return res.status(400).json({
        message: "Bad request",
      });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const { email = "", password = "", name = "" } = req.body;

    if (password.length < 6) {
      return res.status(400).json({
        message: "la contraseña debe de ser de 6 caracteres o más",
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        message: "El nombre debe de se de 2 o más caracteres",
      });
    }

    if (!validations.isValidEmail(email)) {
      return res.status(400).json({
        message: "El Correo no es valido",
      });
    }

    await db.connect();
    const user = await User.findOne({ email });

    if (user) {
      await db.disconnect();
      return res.status(404).json({ message: "Ese correo ya está registrado" });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      password: bcrypt.hashSync(password),
      role: "client",
      name,
    });

    await newUser.save({ validateBeforeSave: true });

    const { _id, role } = newUser;

    const token = jwt.signToken(_id, email);

    return res.status(200).json({
      token,
      user: {
        role,
        name,
        email,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
