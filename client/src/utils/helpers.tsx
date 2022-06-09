import { ResultInterface } from '../types/types';

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
