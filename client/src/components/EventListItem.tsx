import { FC } from 'react';
import { eve } from '../types/types';
import { Box, Button } from '@chakra-ui/react';
import { getFirebase } from '../firebase';
import { result } from '../types/types';
import { collection, doc, updateDoc, runTransaction } from 'firebase/firestore';

const { auth, firestore } = getFirebase();

interface Props {
  eve: eve;
}

// Add eventID in entering collection of user
// Add Start Result of user to event

const EventListItem: FC<Props> = ({ eve }) => {
  const addEntry = async () => {
    const thisEvent = await doc(firestore, `events/${eve.eventId}`);

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

  return (
    <Box border='1px'>
      <h1>{eve.title}</h1>
      <h3>{eve.venue}</h3>
      <Button onClick={addEntry}>Compete</Button>
      <Button>Start Event</Button>
    </Box>
  );
};

export default EventListItem;
