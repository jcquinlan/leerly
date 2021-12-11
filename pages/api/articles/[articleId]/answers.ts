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
        return;
      }

      // Get all the answers for this userId/articleId
      const answersRefs = await adminFirestore
        .collection("article_answers")
        .where("articleId", "==", articleId)
        .where("userId", "==", userId)
        .get();
      
      if (answersRefs.empty) {
        res.statusCode = 200;
        res.send({});
        return;
      }

      // We should only ever have 1 answer object for each article/user combination
      const answerObject = answersRefs.docs[0].data();

      res.statusCode = 200;
      res.send(answerObject);
      return;
    } catch (error) {
      res.statusCode = 500;
      res.json({ error });
    }
  }

  if (req.method === "POST") {
    try {
      const { isPublic, answers } = req.body;
      const { articleId } = req.query;
      const userId = await getUserId(req);

      // If the userId, isPublic, answers, or articleId are undefined, return a 400 error
      if (!userId || isPublic === undefined || !answers || !articleId) {
        res.statusCode = 400;
        res.json({
          isPublic: isPublic,
          articleId: articleId,
          answers: answers,
          text: "Missing Required Field",
        });
        return;
      }

      let answerData;
      const preexistingAnswers = await adminFirestore
        .collection("article_answers")
        .where('userId', '==', userId)
        .where('articleId', '==', articleId)
        .get();
      
      if (!preexistingAnswers.empty) {
        await adminFirestore
          .collection("article_answers")
          .doc(preexistingAnswers.docs[0].id)
          .set({
            isPublic,
            answers,
          }, {merge: true});

        answerData = preexistingAnswers.docs[0].data;
        
      } else {
        answerData = await adminFirestore
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
          .then((answerRef) => answerRef.get())
          .then(ref => ref.data());
      }

      res.statusCode = 201;
      res.send({ answer: answerData });
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
