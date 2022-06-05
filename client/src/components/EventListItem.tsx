import { FC } from 'react';
import { EventInterface } from '../types/types';
import { Box, Button } from '@chakra-ui/react';
import { addPlayer, createSchedule } from '../utils/firestore';

interface Props {
  eve: EventInterface;
  setCurrentEvent: Function;
}

const EventListItem: FC<Props> = ({ eve, setCurrentEvent }) => {
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
