import { getUserProfile, isUserAdmin } from '../../../services/server/userService'
import { isUserOnPremiumPlan } from '../../../services/server/stripeService'
import { getArticles, saveArticle } from '../../../services/server/serverArticleService'

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const queryString = req.query.query
      const filtersString = req.query.filters
      const filters = filtersString ? filtersString.split(',') : []

      const userProfileRef = await getUserProfile(req)
      const customerId = userProfileRef.data().customerId

      if (!customerId) {
        res.statusCode = 401
        res.json({ error: `No customerId found for user profile ${uid}` })
      }

      const isOnPremiumPlan = await isUserOnPremiumPlan(customerId)
      const { data: articles, error } = await getArticles(filters, queryString)

      const cleanedArticles = isOnPremiumPlan
        ? articles
        : articles.map(article => {
          return {
            ...article,
            body: body.slice(0, 220)
          }
        })

      if (error) {
        throw error
      }

      res.statusCode = 200
      res.json({ data: cleanedArticles })
    } catch (error) {
      res.statusCode = 500
      res.json({ error: error.message })
    }
  }

  if (req.method === 'POST') {
    try {
      const isAdmin = await isUserAdmin(req)

      if (!isAdmin) {
        res.statusCode = 401
        res.json({ error: 'Admins only </3' })
        return
      }

      const { data, error } = await saveArticle(req.body)

      if (error) {
        res.statusCode = 400
        res.json(error)
        return
      }

      res.statusCode = 201
      res.json({ data: data[0] })
    } catch (error) {
      res.statusCode = 500
      res.json({ error: error.message })
    }
  }
}
