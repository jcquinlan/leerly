import { NextApiRequest, NextApiResponse } from "next";
import { adminFirestore } from "services/admin";
import { getAuthors } from "../../../services/server/userService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const authors = await getAuthors();

      res.statusCode = 200;
      res.send({authors});
      return;
    } catch (error) {
      res.statusCode = 500;
      res.json({ error });
    }
  }
};
