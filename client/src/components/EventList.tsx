import { FC } from 'react';
import { eve } from '../types/types';
import EventListItem from './EventListItem';
import { nanoid } from 'nanoid';
import { Box } from '@chakra-ui/react';

interface Props {
  eves: eve[];
  setCurrentEvent: Function;
}

const EventList: FC<Props> = (props) => {
  return (
    <Box w='30%'>
      {props.eves &&
        props.eves.map((eve) => {
          return <EventListItem eve={eve} key={nanoid()} setCurrentEvent={props.setCurrentEvent} />;
        })}
    </Box>
  );
};

export default EventList;
