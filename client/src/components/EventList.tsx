import { FC, useState, useRef } from 'react';
import {
  EventInterface,
  MatchInterface,
  StandingsInterface,
} from '../types/types';
import EventListItem from './EventListItem';
import { nanoid } from 'nanoid';
import { Box } from '@chakra-ui/react';
import { sortEventList } from '../utils/helpers';
import * as Scroll from 'react-scroll';

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;

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

  const scrollToTop = () => {
    console.log(topRef);
    topRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const stylez = {
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#eeeeee',
      borderRadius: '24px',
    },
  };

  return (
    <div style={{ overflowY: 'scroll' }}>
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
                scrollToTop={scrollToTop}
              />
            );
          })}
      </Box>
    </div>
  );
};

export default EventList;
