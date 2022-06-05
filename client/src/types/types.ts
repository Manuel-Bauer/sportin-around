export interface EventInterface {
  eventId?: String;
  ownerId: String;
  title: String;
  venue: String;
  date: Date;
  started: Boolean;
  completed: Boolean;
  type: String;
  matches?: MatchInterface[];
  result?: ResultInterface[];
}

export interface MatchInterface {
  matchId?: String;
  ownerId: String;
  matchday: Number;
  home: ScoreInterface | undefined;
  away: ScoreInterface | undefined;
}

export interface ScoreInterface {
  uid: String;
  score: Number;
  points: Number;
}

export interface ResultInterface {
  uid: String;
  totalPoints: Number;
  totalScored: Number;
  totalConceded: Number;
  rank: Number;
}

export interface User {
  uid: String;
  username: String;
  avatar: String;
  stats: [];
}
