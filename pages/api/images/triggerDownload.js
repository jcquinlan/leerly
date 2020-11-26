import Unsplash, {toJson} from 'unsplash-js';

const unsplash = new Unsplash({ accessKey: process.env.UNSPLASH_ACCESS_KEY });

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
        const image = req.body.image;

        await unsplash.photos.downloadPhoto(image)

        res.statusCode = 200;
        res.json({});
    } catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.error(e);
    }
  }
}
