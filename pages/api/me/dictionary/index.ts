import {NextApiRequest, NextApiResponse} from 'next';
import {adminFirestore} from '../../../../services/admin';
import {getUserProfile, getUserId} from '../../../../services/server/userService';
import {WordMap} from '../../../../corpus';
import {mapUserLevelToWordDifficulty} from 'services/corpusService';
import {WORD_COMPLETION_NUMBER} from '../../../../constants';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const userProfile = await getUserProfile(req);
    const userProfileData = userProfile.data();
    const userId = await getUserId(req);
    const userSpanishLevel = userProfileData?.levels?.spanish;

    if (!userSpanishLevel) {
        res.statusCode = 400;
        res.send({error: 'User does not have a level of difficulty selected'});
        return; 
    }

    const targetDiffiultyLevel = mapUserLevelToWordDifficulty(userSpanishLevel);

    const wordCountRecords = await adminFirestore
      .collection('word_counts')
      .where('userId', '==', userId)
      .get();

    const wordCountsSum = wordCountRecords.docs.reduce<Record<string, number>>((memo, doc) => {
      const wordCountRecord = doc.data();
      const wordCountWords = wordCountRecord.words;

      Object.keys(wordCountWords).forEach(word => {
          const wordMapEntry = WordMap[word];

          if (wordMapEntry && wordMapEntry.grade === targetDiffiultyLevel) {
                const infinitiveForm = wordMapEntry.infinitive;
                const wordKey = infinitiveForm || word;
                const currentSummedWordCount = memo[wordKey];

                if (!currentSummedWordCount) {
                    memo[wordKey] = wordCountWords[word];
                } else {
                    memo[wordKey] = memo[wordKey] + wordCountWords[word];
                }
          }
      });

      return memo;
    }, {});

    const allWordsInDifficulty = Object.keys(WordMap).reduce((memo, word) => {
        const wordMapEntry = WordMap[word];

        if (wordMapEntry.grade === targetDiffiultyLevel) {
            const infinitiveForm = wordMapEntry.infinitive;
            if (infinitiveForm) {
                memo[infinitiveForm] = 0;
            } else {
                memo[word] = 0;
            }

            return memo;
        } else {
            return memo;
        }
    }, {});

    const listOfWords = Object.keys(allWordsInDifficulty);
    const listOfWordsWithCounts = listOfWords.map(word => {
        const wordCountRecord = wordCountsSum[word];
        return {
            word,
            count: wordCountRecord ? wordCountRecord : 0,
            completed: wordCountRecord ? wordCountRecord >= WORD_COMPLETION_NUMBER : false
        }
    });

    const sortedListOfWordsWithCounts = listOfWordsWithCounts.sort((a, b) => {
        return b.count - a.count;
    });


    res.statusCode = 200;
    res.send(sortedListOfWordsWithCounts);
    return;
  }
}
