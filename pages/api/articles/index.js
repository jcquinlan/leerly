import {adminFirestore} from '../../../services/admin';

export default async (req, res) => {
    if (req.method === 'GET') {
        const filtersString = req.query.filters;
        const filters = filtersString ? filtersString.split(',') : [];

        let articlesQuery = adminFirestore
            .collection('articles')
            .where('free', '!=', true)

        if (filters.length) {
            articlesQuery = articlesQuery.where('types', 'array-contains-any', filters);
        }

        const articles = await articlesQuery
            .get()
            .catch(err => {
                console.log(err);
                throw err;
            });

        const articlesData = articles.docs.map(doc => {
            const data = doc.data();
            delete data.body;
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

        // Return a response to acknowledge receipt of the event
        res.statusCode = 200;
        res.json({articles: articlesData});
    }
}
