import { db } from "@/database";
import { IProduct } from "@/interfaces";
import { Product } from "@/models";
import { getUrlImage } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      message: string;
    }
  | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProductsBySlug(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}
const getProductsBySlug = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  await db.connect();
  const { slug } = req.query;
  const product = await Product.findOne({ slug: slug }).lean();
  await db.disconnect();

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  product.images = product.images.map((image) => {
    return getUrlImage(image);
  });
  return res.status(200).json(product);
};
