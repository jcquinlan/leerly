import Unsplash, { toJson } from 'unsplash-js'

const unsplash = new Unsplash({ accessKey: process.env.UNSPLASH_ACCESS_KEY })

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const query = req.body.query

      const imagesJson = await unsplash.search.photos(query, 1, 20, { orientation: 'landscape' })
        .then(toJson)

      res.statusCode = 200
      res.json(imagesJson)
    } catch (e) {
      console.error(e)
      res.statusCode = 500
      res.error(e)
    }
  }
}
