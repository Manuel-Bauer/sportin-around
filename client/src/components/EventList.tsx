import { FC, useContext } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import EventListItem from './EventListItem';
import { nanoid } from 'nanoid';
import { Box } from '@chakra-ui/react';
import { MainContext } from '../App';

interface Props {
  eves: EventInterface[];
}

const EventList: FC<Props> = ({ eves }) => {

  return (
    <Box>
      {eves &&
        eves.map((eve) => {
          return (
            <EventListItem
              eve={eve}
              key={nanoid()}
            />
          );
        })}
    </Box>
  );
};

export default EventList;
