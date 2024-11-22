// pages/api/internships/[slug]/route.ts

import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import InternshipModel from '@/models/internship';

const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDb();

  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await InternshipModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Internship deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete internship" });
    }
  } else if (req.method === "PUT") {
    try {
      const internship = await InternshipModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(internship);
    } catch (error) {
      res.status(500).json({ error: "Failed to update internship" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
