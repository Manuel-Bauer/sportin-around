export interface EventInterface {
  eventId?: string;
  owner: UserInterface;
  title: string;
  venue: string;
  date: Date;
  started: boolean;
  completed: boolean;
  type: string;
  entries: UserInterface[];
}

export interface MatchInterface {
  matchId?: string;
  eventId?: string;
  owner: UserInterface;
  matchday: number;
  started: boolean;
  home: ScoreInterface | undefined;
  away: ScoreInterface | undefined;
}

export interface ScoreInterface {
  uid: string;
  score: number;
  points: number;
}

export interface StandingsInterface {
  completed: boolean;
  eventId: string;
  standing: ResultInterface[];
}

export interface ResultInterface {
  user: UserInterface;
  totalPoints: number;
  totalScored: number;
  totalConceded: number;
  totalPlayed: number;
}

export interface UserInterface {
  uid: string;
  username: string;
  avatar: string;
  stats: never[];
}

export interface MainContextInterface {
  currentEvent: EventInterface | undefined;
  currentMatches: MatchInterface[];
  updateCurrent: Function;
}
