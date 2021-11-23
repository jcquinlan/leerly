import { NextApiRequest, NextApiResponse } from "next";
import { adminFirestore } from "services/admin";
import { getUserId } from "../../../../services/server/userService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const userId = await getUserId(req);
      const { articleId } = req.query;

      // Return a 400 error if the user is missing userId or articleId
      if (!userId || !articleId) {
        res.statusCode = 400;
        res.json({
          userId: userId,
          articleId: articleId,
          text: "Missing Required Field",
        });
      }
      // Get all the UserRecords for this userId/articleId
      const answersRef = await adminFirestore
        .collection("article_questions")
        .where("articleId", "==", articleId, "&&", "userId", "==", userId)
        .get();

      const answers = answersRef.docs
        .map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
          };
        })
        .sort((a, b) => {
          return a.created_at._seconds - b.created_at._seconds;
        });
      // Return them in the response below.

      // const answers = [];

      res.statusCode = 200;
      res.send({ answers });
      return;
    } catch (error) {
      res.statusCode = 500;
      res.json({ error });
    }
  }

  if (req.method === "POST") {
    try {
      var { userId, isPublic, answers } = req.body;
      var { articleId } = req.query;

      // If the userId, isPublic, answers, or articleId are undefined, return a 400 error
      if (!userId || !isPublic || !answers || !articleId) {
        res.statusCode = 400;
        res.json({
          userId: userId,
          isPublic: isPublic,
          articleId: articleId,
          answers: answers,
          text: "Missing Required Field",
        });
      }
      
      const answerRef = await adminFirestore
        .collection("article_answers")
        .add({
          userId,
          articleId,
          isPublic,
          answers,
          created_at: new Date(),
          deleted_at: null,
          reported: false,
        })
        .then((answerRef) => answerRef.get());

      // Should we denormalize any extra data? Like the article title, maybe? I dunno, we can discuss.
      const answer = answerRef.data();

      res.statusCode = 201;
      res.send({ answer });
    } catch (error) {
      res.statusCode = 500;
      res.json({ error });
    }
  }

  if (req.method === "PUT") {
    const userId = await getUserId(req);
    const { isPublic, answers } = req.body;
    const { articleId } = req.query;

    // Do we want to allow a user to update their answers after already filling them out?
    // If so, we will need to also handle PUT requests here.

    // Check to see if there is already a UserAnswers record for this user and articleId.
    // If so, overwrite the existing data with what they just sent up.

    // If there isn't a UserAnswers record (there always should be, though), then create a new record with
    // the data they just sent up.

    res.statusCode = 200;
    res.send({ message: "Answers updated" });
    return;
  }
};
