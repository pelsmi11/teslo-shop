import { db } from "@/database";
import { Order, Product, User } from "@/models";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      name: string;
    }
  | {
      numberOfOrders: number;
      paidOrders: number; // isPaid true
      noPaidOrders: number;
      numberOfClients: number; // role: client
      numberOfProducts: number;
      productsWithNoInventory: number; // 0
      lowInventory: number; // products lows of 10 items
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.connect();
  //   const numberOfOrders = await Order.count();
  //   const paidOrders = await Order.find({ isPaid: true }).count();
  //   const numberOfClients = await User.find({ role: "client" }).count();
  //   const numberOfProducts = await Product.count();
  //   const productsWithNoInventory = await Product.find({ inStock: 0 }).count();
  //   const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();

  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    await Order.count(),
    await Order.find({ isPaid: true }).count(),
    await User.find({ role: "client" }).count(),
    await Product.count(),
    await Product.find({ inStock: 0 }).count(),
    await Product.find({ inStock: { $lte: 10 } }).count(),
  ]);

  await db.disconnect();
  res.status(200).json({
    numberOfOrders,
    paidOrders,
    noPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  });
}
