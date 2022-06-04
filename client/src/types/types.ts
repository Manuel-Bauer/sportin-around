export interface eve {
  eventId?: String;
  ownerId: String;
  title: String;
  venue: String;
  date: Date;
  started: Boolean;
  completed: Boolean;
  type: String;
  matches?: match[];
  result?: result[];
}

export interface match {
  matchId?: String;
  ownerId: String;
  matchday: Number;
  home: score;
  away: score;
}

export interface score {
  userId?: String;
  score: Number;
  points: Number;
}

export interface result {
  userId?: String;
  totalPoints: Number;
  totalScored: Number;
  totalConceded: Number;
  rank: Number;
}
