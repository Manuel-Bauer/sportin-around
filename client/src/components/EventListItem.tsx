import { FC, useState, useContext } from 'react';
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
import { MainContext } from '../App';

const { firestore } = getFirebase();

interface Props {
  eve: EventInterface;
}

const EventListItem: FC<Props> = ({ eve }) => {
  const { updateCurrent } = useContext(MainContext);

  return (
    <Box border='1px'>
      <h1>{eve.title}</h1>
      <h3>{eve.venue}</h3>
      <Button onClick={() => addPlayer(eve.eventId)}>Compete</Button>
      <Button onClick={() => createSchedule(eve)}>Start Event</Button>
      <Button onClick={() => updateCurrent(eve)}>Event Details</Button>
    </Box>
  );
};

export default EventListItem;
