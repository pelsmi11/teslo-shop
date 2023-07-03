import { IOrder, IOrderItem } from "@/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]";
import { db, dbProducts } from "@/database";
import { Product, Order } from "@/models";

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handleOrders(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);
    default:
      return res.status(404).json({ message: "Bad request" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;
  // Verificar que tengamos un usuario
  //   const session: any = await getSession({ req });
  const session: any = await getServerSession(req, res, authOptions);

  if (!session) {
    return res
      .status(401)
      .json({ message: "Debe de estar autenticado para hacer esto" });
  }

  //Crear un arreglo con los produtos que la persona quiere
  const productsIds = orderItems.map((orderItem) => orderItem._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod) => prod.id === current._id
      )!.price;
      if (!currentPrice) {
        throw new Error(`Verifique el carrito de nuevo, producto no existe`);
      }
      return currentPrice * current.quantity + prev;
    }, 0);

    const taxRate = 1.12;
    const backendTotal = subTotal * taxRate;

    if (total !== backendTotal) {
      console.log({ total, backendTotal });
      throw new Error(`El total no cuadra con el monto`);
    }

    //todo bien a este punto
    const userId = session.user.id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (err: any) {
    await db.disconnect();
    console.log(err);
    res.status(400).json({
      message: err.message || "Revise logs del servidor",
    });
  }
};
