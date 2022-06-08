export interface EventInterface {
  eventId?: string;
  ownerId: string;
  title: string;
  venue: string;
  date: Date;
  started: boolean;
  completed: boolean;
  type: string;
  entries: string[];
}

export interface MatchInterface {
  matchId?: string;
  eventId?: string;
  ownerId: string;
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

export interface Standings {
  completed: boolean;
  eventId: string;
  standing: ResultInterface[];
}

export interface ResultInterface {
  uid: string;
  totalPoints: number;
  totalScored: number;
  totalConceded: number;
  totalPlayed: number;
}

export interface User {
  uid: string;
  username: string;
  avatar: string;
  stats: [];
}

export interface MainContextInterface {
  currentEvent: EventInterface | undefined;
  currentMatches: MatchInterface[];
  updateCurrent: Function;
}
