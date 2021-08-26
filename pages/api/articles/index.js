import {adminFirestore} from '../../../services/admin';
import {getUserProfile} from '../../../services/server/userService';
import {isUserOnPremiumPlan} from '../../../services/server/stripeService';

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

            const userHasPremiumPlan = await isUserOnPremiumPlan(customerId);
            let articlesQuery = adminFirestore
                .collection('articles')
                .where('published', '==', true)
    
            if (filters.length) {
                articlesQuery = articlesQuery.where('types', 'array-contains-any', filters);
            }

            const articles = await articlesQuery.get();

            const articlesData = articles.docs.map(doc => {
                const data = doc.data();

                // For people who are not on free accounts, we want to hide the text of the articles
                if (!userHasPremiumPlan) {
                    delete data.body;
                }

                return {
                    id: doc.id,
                    ...data,
                    // Wanna know something dumb?
                    // The Admin SDK handles timestamps a little
                    // differently than the clientside SDK,
                    // we we need to manually change _seconds and _nanoseconds
                    // to just seconds and nanoseconds
                    added_at: {
                        seconds: data.added_at._seconds,
                        nanoseconds: data.added_at._nanoseconds,
                    }
                };
            })

            res.statusCode = 200;
            res.json({data: articlesData});
        } catch (error) {
            res.statusCode = 500;
            res.json({error: error.message});
        }
    }
}
