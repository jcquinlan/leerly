import fetch from 'node-fetch';
import {WordMap} from 'corpus';
import {TranscriptPortion, TranscriptPortionForRender, WordMapEntry} from 'types';
import {prepareTranscript} from 'services/transcriptionService';


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

const addVocabDataToTranscript = (transcript: TranscriptPortionForRender[]): TranscriptPortionForRender[] => {
    return transcript.map((section, index) => {
        const hasWords = !!section.text;

        if (hasWords) {
            const words = section.text.trim().split(' ').map(word => word.toLowerCase());
            let sectionWordEntry: WordMapEntry;

            words.forEach(word => {
                const wordMapEntry = WordMap[word];

                if (wordMapEntry) {
                    sectionWordEntry = wordMapEntry;

                }
            });

            if (sectionWordEntry) {
                return {
                    ...section,
                    wordMapEntry: {
                        grade: sectionWordEntry.grade
                    }
                }
            }
        }
        
        return section;
    })
}

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
        const {transcriptionId} = req.query;
        const isReady = await isTranscriptReady(transcriptionId);

        if (!isReady) {
          res.statusCode = 202; // Request accepted, but processing not finished.
          res.json(null);
          return;
        }

        const transcript = await getTranscriptJSON(transcriptionId);
        const preparedTranscript = prepareTranscript(transcript.transcript);
        const transcriptWithVocab = addVocabDataToTranscript(preparedTranscript);

        res.statusCode = 200;
        res.json({transcript: transcriptWithVocab});
    } catch (e) {
        console.error(e);
        res.status(500);
        res.json(e);
    }
  }
}
