import { FC } from 'react';
import { eve } from '../types/types';
import { Box, Button } from '@chakra-ui/react';
import { getFirebase } from '../firebase';
import { result, score, match } from '../types/types';
import { collection, doc, updateDoc, runTransaction } from 'firebase/firestore';
import { nanoid } from 'nanoid';
const robin = require('roundrobin');

const { auth, firestore } = getFirebase();

interface Props {
  eve: eve;
}

const EventListItem: FC<Props> = ({ eve }) => {
  // Add User and Start result to event when user wants to compete
  const addEntry = async () => {
    const thisEvent = doc(firestore, `events/${eve.eventId}`);

    const newResult: any = {
      uid: auth.currentUser.uid,
      totalPoints: 0,
      totalScored: 0,
      totalConceded: 0,
      rank: 0,
    };

    try {
      await runTransaction(firestore, async (transaction) => {
        const eventDoc = await transaction.get(thisEvent);
        if (!eventDoc.exists()) throw 'Event does not exist!';

        const data = eventDoc.data();
        const result = data.result ? [...data.result, newResult] : [newResult];

        transaction.update(thisEvent, { result });
      });
    } catch (e) {
      console.log('Transaction failed: ', e);
    }
  };

  // Save match in event document
  const saveMatch = async (match: match) => {
    const thisEvent = doc(firestore, `events/${eve.eventId}`);

    try {
      await runTransaction(firestore, async (transaction) => {
        const eventDoc = await transaction.get(thisEvent);
        if (!eventDoc.exists()) throw 'Event does not exist!';

        const data = eventDoc.data();
        const matches = data.matches ? [...data.matches, match] : [match];

        transaction.update(thisEvent, { matches });
      });
    } catch (e) {
      console.log('Transaction failed: ', e);
    }
  };

  // Creates schedule based on signed up participant for Event and if it is single round robin or double round robin
  const createSchedule = () => {
    if (!eve.result) throw 'Must have at least two entries';
    const numEntries = eve.result.length;

    let scheduler;

    if (eve.type === 'Single Round-Robin') {
      scheduler = robin(numEntries);
    }

    if (eve.type === 'Double Round-Robin') {
      scheduler = [...robin(numEntries), ...robin(numEntries)];
    }

    scheduler.forEach((matchRef: number[], matchdayIdx: number) => {
      const matchday = matchdayIdx + 1;
      // Why can I not use array of numbers here
      matchRef.forEach((players: any) => {
        // Why can I not assign them to type score
        let home;
        let away;

        if (eve.type === 'Single Round-Robin' && eve.result) {
          // Here I would like to indicate that home should have type score but it gives me an error if I try
          // We need to adjust indexes because robin library starts with 1
          home = {
            uid: eve.result[players[0] - 1].uid,
            score: 0,
            points: 0,
          };
          away = {
            uid: eve.result[players[1] - 1].uid,
            score: 0,
            points: 0,
          };
        }

        // Create first and second lag if its a double round robin format
        if (eve.type === 'Double Round-Robin' && eve.result) {
          home = {
            uid:
              matchday <= (scheduler.length + 1) / 2
                ? eve.result[players[0] - 1].uid
                : eve.result[players[1] - 1].uid,
            score: 0,
            points: 0,
          };
          away = {
            uid:
              matchday <= (scheduler.length + 1) / 2
                ? eve.result[players[1] - 1].uid
                : eve.result[players[0] - 1].uid,
            score: 0,
            points: 0,
          };
        }

        const match: match = {
          matchId: nanoid(),
          ownerId: eve.ownerId,
          matchday: matchday,
          home: home,
          away: away,
        };

        saveMatch(match);
      });
    });
  };

  return (
    <Box border='1px'>
      <h1>{eve.title}</h1>
      <h3>{eve.venue}</h3>
      <Button onClick={addEntry}>Compete</Button>
      <Button onClick={createSchedule}>Start Event</Button>
      <Button>Event Details</Button>
    </Box>
  );
};

export default EventListItem;
