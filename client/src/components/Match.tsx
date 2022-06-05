import { MatchInterface } from '../types/types';
import { FC } from 'react';

interface Props {
  match: MatchInterface;
}

const Match: FC<Props> = ({ match }) => {
  console.log(match);
  return <div>{match?.away?.uid}</div>;
};

export default Match;
