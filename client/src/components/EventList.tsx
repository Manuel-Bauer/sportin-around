import { FC } from 'react';
import { eve } from '../types/types';
import EventListItem from './EventListItem';

interface Props {
  eves: eve[];
}

const EventList: FC<Props> = (props) => {
  return (
    <div>
      {props.eves &&
        props.eves.map((eve) => {
          return <EventListItem eve={eve}/>;
        })}
    </div>
  );
};

export default EventList;
