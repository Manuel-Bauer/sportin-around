import { FC } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import EventListItem from './EventListItem';
import { nanoid } from 'nanoid';
import { Box } from '@chakra-ui/react';

interface Props {
  eves: EventInterface[];
  currentMatches: MatchInterface[];
  setCurrentEvent: Function;
  setCurrentMatches: Function;
}

const EventList: FC<Props> = ({
  eves,
  currentMatches,
  setCurrentEvent,
  setCurrentMatches,
}) => {
  return (
    <Box>
      {eves &&
        eves.map((eve) => {
          return (
            <EventListItem
              eve={eve}
              key={nanoid()}
              setCurrentEvent={setCurrentEvent}
              setCurrentMatches={setCurrentMatches}
            />
          );
        })}
    </Box>
  );
};

export default EventList;
