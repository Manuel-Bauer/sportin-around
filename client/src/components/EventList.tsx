import { FC, useRef } from 'react';
import {
  EventInterface,
  MatchInterface,
  StandingsInterface,
} from '../types/types';
import EventListItem from './EventListItem';
import { nanoid } from 'nanoid';
import { Box } from '@chakra-ui/react';
import { sortEventList, sortEventListDate } from '../utils/helpers';

import './styles.css';

interface Props {
  eves: EventInterface[];
  current: {
    eve: EventInterface;
    matches: MatchInterface[];
    standings: StandingsInterface;
  };
  updateCurrent: Function;
  showEventDetails: boolean;
}

const EventList: FC<Props> = ({
  eves,
  updateCurrent,
  current,
  showEventDetails,
}) => {
  const eventList = showEventDetails
    ? eves && sortEventList(current.eve, eves)
    : eves && sortEventListDate(eves);

  console.log(eventList);

  const topRef = useRef<any>();

  const scrollSidebar = () => {
    topRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className='scrollbar'
      style={{ overflowX: 'hidden', overflowY: 'auto' }}
    >
      <Box ref={topRef} maxH='100vh'>
        {eves &&
          eventList.map((eve: any, index: any) => {
            return (
              <EventListItem
                first={index === 0 ? true : false}
                current={current}
                eve={eve}
                updateCurrent={updateCurrent}
                key={nanoid()}
                scrollSidebar={scrollSidebar}
                showEventDetails={showEventDetails}
              />
            );
          })}
      </Box>
    </div>
  );
};

export default EventList;
