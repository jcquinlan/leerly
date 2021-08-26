import {NextApiRequest, NextApiResponse} from 'next';
import {DateTime} from 'luxon';
import {adminFirestore} from '../../../../services/admin';
import {getUserId} from '../../../../services/server/userService';
import { WordCount } from 'types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
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

        
        if (!wordCountRecordsForToday.empty) {
          // Otherwise, update the preexisting record
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
          
          console.log(updatedWordCounts);

          await adminFirestore
            .collection('word_counts')
            .doc(currentWordCountRecordRef.id)
            .set({words: updatedWordCounts}, {merge: true});

          res.statusCode = 200;
          res.json({});
          return;
        } else {
          const newWordRecord = {
            userId,
            week: now.weekNumber,
            year: now.year,
            date: midnight,
            words
          };

          const wordRecordRef = await adminFirestore
            .collection('word_counts')
            .add(newWordRecord)
            .then(wordRecordRef => wordRecordRef.get());

          res.statusCode = 201;
          res.json(wordRecordRef.data());
          return;
        }
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.send(e);
    }
  }
}
