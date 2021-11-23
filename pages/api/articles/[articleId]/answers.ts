import { NextApiRequest, NextApiResponse } from 'next';
import { getUserId } from '../../../../services/server/userService';

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'GET') {
        const userId = await getUserId(req);
        const { articleId } = req.query;

        // Return a 400 error if the user is missing userId or articleId

        // Get all the UserRecords for this userId/articleId

        // Return them in the response below.

        const answers = [];

        res.statusCode = 200;
        res.send({ answers });
        return;
    }

    if (req.method === 'POST') {
        const userId = await getUserId(req);
        const { isPublic, answers } = req.body;
        const { articleId } = req.query;

        // If the userId, isPublic, answers, or articleId are undefined, return a 400 error

        // Create a new UserAnswers record here, based on the userId, isPublic, answers, and articleId.

        // Should we denormalize any extra data? Like the article title, maybe? I dunno, we can discuss.

        // Return the created UserAnswers record (you can see how we do it in other endpoints)

        res.statusCode = 201;
        res.send({ message: 'Elisabeth smellz' });
        return;
    }


    if (req.method === 'PUT') {
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
        res.send({ message: 'Answers updated' });
        return;
    }
}
