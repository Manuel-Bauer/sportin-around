import { FC } from 'react';
import { eve } from '../types/types';

interface Props {
  currentEvent: eve | undefined;
}

const EventDetails: FC<Props> = ({ currentEvent }) => {
  return <div>{currentEvent && <div>{currentEvent?.title}</div>}</div>;
};

export default EventDetails;
