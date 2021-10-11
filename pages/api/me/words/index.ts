import {NextApiRequest, NextApiResponse} from 'next';
import {DateTime} from 'luxon';
import {adminFirestore} from '../../../../services/admin';
import {getUserId} from '../../../../services/server/userService';
import { WordCount } from 'types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const userId = await getUserId(req);

    const wordCountRecords = await adminFirestore
      .collection('word_counts')
      .where('userId', '==', userId)
      .get();

    const wordCountsData = wordCountRecords.docs.map(doc => {
      const data = doc.data();

      return {
        ...data,
        date: {
          seconds: data.date._seconds,
          nanoseconds: data.date._nanoseconds
        }
      };
    });

    res.statusCode = 200;
    res.send(wordCountsData);
    return;
  }

  if (req.method === 'POST') {
    try {
        const userId = await getUserId(req);
        const words = req.body.words;
        const zone = req.body.tz;

        if (!zone) {
          res.statusCode = 400;
          res.send({error: "No timezone value provided"});
          return;
        }

        if (!words) {
          res.statusCode = 400;
          res.send({error: "No word counts provided"});
          return;
        }

        const now = DateTime.now().setZone(zone);
        const midnight = now.startOf('day').toJSDate();
        const endOfDay = now.endOf('day').toJSDate();

        // Check to see if there is already a record for today
        const wordCountRecordsForToday = await adminFirestore
          .collection('word_counts')
          .where('userId', '==', userId)
          .where('date', '>=', midnight)
          .where('date', '<=', endOfDay)
          .get();

        
        // If so, update the preexisting record
        if (!wordCountRecordsForToday.empty) {
          const currentWordCountRecordRef = wordCountRecordsForToday.docs[0];
          const currentWordCountRecord = currentWordCountRecordRef.data().words;
          const updatedWordCounts = Object.keys(words)
            .reduce<WordCount>((memo, key) => {
              const currentWordCount = memo[key];

              if (currentWordCount && Number.isInteger(currentWordCount)) {
                memo[key] = currentWordCount + words[key];
              } else {
                memo[key] = words[key];
              }

              return memo;
            }, {...currentWordCountRecord});
          
          await adminFirestore
            .collection('word_counts')
            .doc(currentWordCountRecordRef.id)
            .set({words: updatedWordCounts}, {merge: true});

          res.statusCode = 200;
          res.json({});
          return;
        } else {
          // Otherwise, create a new record for today
          const newWordRecord = {
            userId,
            date: midnight,
            words
          };

          await adminFirestore
            .collection('word_counts')
            .add(newWordRecord)

          res.statusCode = 201;
          res.json({});
          return;
        }
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.send(e);
    }
  }
}
