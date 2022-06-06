import { FC, useState } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import { Box, Button } from '@chakra-ui/react';
import { addPlayer, createSchedule } from '../utils/firestore';
import { getFirebase } from '../firebase';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const { firestore } = getFirebase();

interface Props {
  eve: EventInterface;
  setCurrentEvent: Function;
  setCurrentMatches: Function;
}

const EventListItem: FC<Props> = ({
  eve,
  setCurrentEvent,
  setCurrentMatches,
}) => {
  const setEventAndMatches = async (eve: EventInterface) => {
    // Set Current Event
    setCurrentEvent(eve);

    // Set Current Matches
    const matchesCol = collection(firestore, 'matches');
    const matchQuery = query(matchesCol, where('eventId', '==', eve.eventId));

    // Again document data issue
    const matches: any = [];
    const querySnapshot = await getDocs(matchQuery);
    querySnapshot.forEach((doc) => {
      matches.push({ ...doc.data(), matchId: doc.id });
    });
    setCurrentMatches(matches);
  };

  return (
    <Box border='1px'>
      <h1>{eve.title}</h1>
      <h3>{eve.venue}</h3>
      <Button onClick={() => addPlayer(eve.eventId)}>Compete</Button>
      <Button onClick={() => createSchedule(eve)}>Start Event</Button>
      <Button onClick={() => setEventAndMatches(eve)}>Event Details</Button>
    </Box>
  );
};

export default EventListItem;
