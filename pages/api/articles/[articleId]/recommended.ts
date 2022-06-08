import { isUserOnPremiumPlan } from 'services/server/stripeService';
import { getUserProfile } from 'services/server/userService';
import { getArticle, getArticles, getSpecificArticles } from '../../../../services/server/serverArticleService';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const userProfileRef = await getUserProfile(req);
      const customerId = userProfileRef.data().customerId;

      console.log(customerId);

      const { data: article, error } = await getArticle(req.query.articleId);
      const userIsOnPremiumPlan = await isUserOnPremiumPlan(customerId);

      if (error) {
        throw error;
      }

      const types = article.types;

      const { data: articlesBySimilarType, error: recommendationsError } = await getArticles(types, undefined, { free: !userIsOnPremiumPlan });

      if (recommendationsError) {
        throw recommendationsError;
      }

      if (articlesBySimilarType.length === 0) {
        res.statusCode = 200;
        res.json({ data: [] });
      }

      const articlesWithoutTargetArticle = articlesBySimilarType.filter((currArticle) => currArticle.id !== article.id);
      const articlesBySimilarity = articlesWithoutTargetArticle.map((suggestedArticle) => {
        const getScore = () => {
          let score = 0;

          if (suggestedArticle.level === article.level) {
            score += 1;
          }

          const similarTypesInCommon = suggestedArticle.types.reduce((memo, currentType) => {
            if (article.types.includes(currentType)) {
              return memo + 1;
            }

            return memo;
          }, 0);

          return score + similarTypesInCommon;
        };

        return {
          id: suggestedArticle.id,
          score: getScore()
        };
      });

      const articlesSortedByScore = articlesBySimilarity.sort((a, b) => {
        return b.score - a.score;
      });

      const articleIdsToChoose = articlesSortedByScore.slice(0, 2).map(item => item.id);

      const { data: specificArticles, error: specificArticlesError } = await getSpecificArticles(articleIdsToChoose);

      if (specificArticlesError) {
        throw specificArticlesError;
      }

      res.statusCode = 200;
      res.json({ data: specificArticles });
    } catch (error) {
      res.statusCode = 500;
      res.json({ error: error.message });
    }
  }
};
