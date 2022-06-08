import { FC, useContext } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import EventListItem from './EventListItem';
import { nanoid } from 'nanoid';
import { Box } from '@chakra-ui/react';

interface Props {
  eves: EventInterface[];
  updateCurrent: Function;
}

const EventList: FC<Props> = ({ eves, updateCurrent }) => {
  return (
    <Box>
      {eves &&
        eves.map((eve) => {
          return (
            <EventListItem
              eve={eve}
              updateCurrent={updateCurrent}
              key={nanoid()}
            />
          );
        })}
    </Box>
  );
};

export default EventList;
