import {adminFirestore} from '../../../services/admin';
import {getUserProfile} from '../../../services/server/userService';
import {isUserOnPremiumPlan} from '../../../services/server/stripeService';
import {getArticles} from '../../../services/server/serverArticleService';

export default async (req, res) => {

    if (req.method === 'GET') {
        try {
            const filtersString = req.query.filters;
            const filters = filtersString ? filtersString.split(',') : [];

            const userProfileRef = await getUserProfile(req);
            const customerId = userProfileRef.data().customerId;

            if (!customerId) {
                res.statusCode = 401;
                res.json({error: `No customerId found for user profile ${uid}`});
            }

            const {data: articles, error} = await getArticles();

            if (error) {
                throw error;
            }

            res.statusCode = 200;
            res.json({data: articles});
        } catch (error) {
            res.statusCode = 500;
            res.json({error: error.message});
        }
    }
}
