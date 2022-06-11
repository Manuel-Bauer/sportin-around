import { FC, useContext } from 'react';
import {
  EventInterface,
  MatchInterface,
  StandingsInterface,
} from '../types/types';
import EventListItem from './EventListItem';
import { nanoid } from 'nanoid';
import { Box } from '@chakra-ui/react';
import { sortEventList } from '../utils/helpers';

interface Props {
  eves: EventInterface[];
  current: {
    eve: EventInterface;
    matches: MatchInterface[];
    standings: StandingsInterface;
  };
  updateCurrent: Function;
}

const EventList: FC<Props> = ({ eves, updateCurrent, current }) => {
  const eventList = current.eve ? sortEventList(current.eve, eves) : eves;

  return (
    <Box
      maxH='100vh'
      overflowY='scroll'
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'lightgray',
          borderRadius: '24px',
        },
      }}
    >
      {eves &&
        eventList.map((eve) => {
          return (
            <EventListItem
              current={current}
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
