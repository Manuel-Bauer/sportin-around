import { FC } from 'react';
import { eve } from '../types/types';
import { Box, Button } from '@chakra-ui/react';
import { addPlayer, createSchedule } from '../utils/firestore';

interface Props {
  eve: eve;
  setCurrentEvent: Function;
}

const EventListItem: FC<Props> = ({ eve, setCurrentEvent }) => {
  // Add User and Start result to event when user wants to compete

  // Save match in event document

  return (
    <Box border='1px'>
      <h1>{eve.title}</h1>
      <h3>{eve.venue}</h3>
      <Button onClick={() => addPlayer(eve.eventId)}>Compete</Button>
      <Button onClick={() => createSchedule(eve)}>Start Event</Button>
      <Button onClick={() => setCurrentEvent(eve)}>Event Details</Button>
    </Box>
  );
};

export default EventListItem;
