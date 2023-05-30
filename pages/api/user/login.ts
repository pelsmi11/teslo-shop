import { db } from "@/database";
import { User } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { jwt } from "@/utils";

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
      console.log("hola");
      return loginUser(req, res);
    default:
      return res.status(400).json({
        message: "Bad request",
      });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { email = "", password = "" } = req.body;
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user) {
      return res
        .status(404)
        .json({ message: "Correo o contraseña no válidos" });
    }
    if (!bcrypt.compareSync(password, user.password!)) {
      return res
        .status(404)
        .json({ message: "Correo o contraseña no válidos" });
    }
    const { role, name } = user;
    const token = jwt.signToken(user._id, email);

    return res.status(200).json({
      token,
      user: {
        role,
        name,
        email,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
