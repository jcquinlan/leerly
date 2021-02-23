import fetch from 'node-fetch';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
        const {transcriptionId} = req.query;

        const url = `https://api.sonix.ai/v1/media/${transcriptionId}/transcript.json`;
        const request = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.SONIX_API_KEY}`
            }
        };

        const response = await fetch(url, request);
        const json = await response.json();

        res.statusCode = 200;
        res.json(json);
    } catch (e) {
        console.error(e);
        res.status(500);
        res.json(e);
    }
  }
}
