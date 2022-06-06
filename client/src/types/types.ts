export interface EventInterface {
  eventId?: string;
  ownerId: string;
  title: string;
  venue: string;
  date: Date;
  started: boolean;
  completed: boolean;
  type: string;
  result?: ResultInterface[];
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

export interface ResultInterface {
  uid: string;
  totalPoints: number;
  totalScored: number;
  totalConceded: number;
  rank: number;
}

export interface User {
  uid: string;
  username: string;
  avatar: string;
  stats: [];
}
