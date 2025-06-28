import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { productId, buyerName, phone, comment } = req.body;

  if (!productId || !buyerName || !phone || !comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  return res.status(200).json({ success: true });
}
