import { getArticle, updateArticle } from '../../../../services/server/serverArticleService';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { data: article, error } = await getArticle(req.query.articleId);

      if (error) {
        throw error;
      }

      res.statusCode = 200;
      res.json({ data: article });
    } catch (error) {
      res.statusCode = 500;
      res.json({ error: error.message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { articleId } = req.query;
      const content = req.body;
      await updateArticle(articleId, content);

      res.statusCode = 200;
      res.json({ data: content });
    } catch (error) {
      res.statusCode = 500;
      res.json({ error: error.message });
    }
  }
}
