import { FC, useRef } from 'react';
import {
  EventInterface,
  MatchInterface,
  StandingsInterface,
} from '../types/types';
import EventListItem from './EventListItem';
import { nanoid } from 'nanoid';
import { Box } from '@chakra-ui/react';
import { sortEventList } from '../utils/helpers';

import './styles.css';

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

  const topRef = useRef<any>();

  const scrollSidebar = () => {
    topRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className='scrollbar'
      style={{ overflowY: 'auto', overflowX: 'hidden' }}
    >
      <Box ref={topRef} maxH='100vh'>
        {eves &&
          eventList.map((eve, index) => {
            return (
              <EventListItem
                first={index === 0 ? true : false}
                current={current}
                eve={eve}
                updateCurrent={updateCurrent}
                key={nanoid()}
                scrollSidebar={scrollSidebar}
              />
            );
          })}
      </Box>
    </div>
  );
};

export default EventList;
