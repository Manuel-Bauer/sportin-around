import { ResultInterface, EventInterface } from '../types/types';

export const sortStandings = (
  standings: ResultInterface[]
): ResultInterface[] => {
  return standings.sort((a, b) => {
    if (a.totalPoints > b.totalPoints) return -1;
    else if (a.totalPoints < b.totalPoints) return 1;
    else if (a.totalScored - a.totalConceded > b.totalScored - b.totalConceded)
      return -1;
    else if (a.totalScored - a.totalConceded < b.totalScored - b.totalConceded)
      return 1;
    else return b.totalScored - a.totalScored;
  });
};

export const sortEventListDate = (eventList: any) => {
  return eventList.sort((a: any, b: any) => {
    return new Date(a.date).valueOf() - new Date(b.date).valueOf();
  });
};

export const sortEventList = (
  currentEvent: EventInterface,
  eventList: EventInterface[]
) => {
  return [
    currentEvent,
    ...sortEventListDate(
      eventList.filter((eve) => eve.eventId !== currentEvent.eventId)
    ),
  ];
};

export const isUserSignedUp = (eve: EventInterface, uid: string) => {
  if (
    eve.entries.map((entry) => entry.uid).includes(uid) ||
    eve.owner.uid === uid
  ) {
    return true;
  } else return false;
};
