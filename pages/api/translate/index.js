// Imports the Google Cloud client library
import TranslationClient from '@google-cloud/translate'
const { Translate } = TranslationClient.v2

// Creates a client
const translate = new Translate()

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const text = 'The text to translate, e.g. Hello, world!';
// const target = 'The target language, e.g. ru';

async function translateText (text) {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translations] = await translate.translate(text, 'en')
  translations = Array.isArray(translations) ? translations[0] : translations
  return translations
}

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const text = req.body.text

      const translation = await translateText(text)
      res.statusCode = 200
      res.json({ translation })
    } catch (e) {
      console.error(e)
      res.statusCode = 500
      res.error(e)
    }
  }
}
