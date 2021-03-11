import fetch from 'node-fetch';

const getTranscriptJSON = async (transcriptId) => {
  try {
    const url = `https://api.sonix.ai/v1/media/${transcriptId}/transcript.json`;
    const request = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.SONIX_API_KEY}`
        }
    };

    const response = await fetch(url, request);
    return await response.json();
  } catch (e) {
    throw e;
  }
}

const isTranscriptReady = async (transcriptId) => {
  try {
    const url = `https://api.sonix.ai/v1/media/${transcriptId}`;
    const request = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.SONIX_API_KEY}`
        }
    };

    const response = await fetch(url, request);
    const data = await response.json();

    return data.status === 'completed';
  } catch (e) {
    throw e;
  }
}

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
        const {transcriptionId} = req.query;
        const isReady = await isTranscriptReady(transcriptionId);

        if (!isReady) {
          res.statusCode = 202; // Request accept, but processing not finished.
          res.json(null);
          return;
        }

        const transcript = await getTranscriptJSON(transcriptionId);

        res.statusCode = 200;
        res.json(transcript);
    } catch (e) {
        console.error(e);
        res.status(500);
        res.json(e);
    }
  }
}
