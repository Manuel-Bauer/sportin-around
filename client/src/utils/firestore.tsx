import { getFirebase } from '../firebase';
import {
  doc,
  runTransaction,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { MatchInterface, EventInterface, UserInterface } from '../types/types';

const robin = require('roundrobin');

const { auth, firestore } = getFirebase();

export const getStanding = async (eventId: string | undefined) => {
  const standingsCol = collection(firestore, 'standings');
  const standingsQuery = query(standingsCol, where('eventId', '==', eventId));

  let standings: any = {};
  const standingsSnapshot = await getDocs(standingsQuery);
  standingsSnapshot.forEach((doc) => {
    standings = doc.data();
  });
  return standings;
};

// Get User
export const getUser = async (uid: string) => {
  const userRef = doc(firestore, 'users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) return snap.data();
};

// Get Match
export const getMatch = async (matchId: string | undefined) => {
  const matchRef = doc(firestore, `matches/${matchId}`);
  const snap = await getDoc(matchRef);
  if (snap.exists()) return snap.data();
};

// Add User to Firestore on first login. Again: How to add Firebase types
export const addUser = () => {
  const user = auth.currentUser;
  const userDoc = doc(firestore, `users/${user.uid}`);
  const newUser = {
    uid: user.uid,
    username: user.displayName,
    avatar: user.photoURL,
    stats: [],
  };
  setDoc(userDoc, newUser);
};

// Add User to Event
export const addPlayer = async (eventId: String | undefined) => {
  const thisEvent = doc(firestore, `events/${eventId}`);

  try {
    await runTransaction(firestore, async (transaction) => {
      const eventDoc = await transaction.get(thisEvent);
      if (!eventDoc.exists()) throw 'Event does not exist!';

      const data = eventDoc.data();
      const user = await getUser(auth.currentUser.uid);

      const newEntries = data.entries ? [...data.entries, user] : [user];

      transaction.update(thisEvent, { entries: newEntries });
    });
  } catch (e) {
    console.log('Transaction failed: ', e);
  }
};

// CREATE MATCH
const saveMatch = async (
  match: MatchInterface,
  eventId: String | undefined
) => {
  const matchToAdd = { ...match, eventId: eventId };
  const matchesCol = collection(firestore, 'matches');
  await addDoc(matchesCol, matchToAdd);
};

// CREATE STANDING
const saveStanding = async (eve: EventInterface) => {
  const results = eve.entries.map((entry: any) => {
    return {
      user: entry,
      totalPoints: 0,
      totalScored: 0,
      totalConceded: 0,
      totalPlayed: 0,
    };
  });
  const standingToAdd = {
    completed: false,
    eventId: eve.eventId,
    standing: results,
  };

  const standingDoc = doc(firestore, `standings/${eve.eventId}`);
  setDoc(standingDoc, standingToAdd);
};

// Creates schedule based on signed up participant for Event and if it is single round robin or double round robin
export const createSchedule = async (eve: EventInterface) => {
  // Save Standings for Tournaement in Standings collection
  await saveStanding(eve);

  if (!eve.entries) throw 'Must have at least two entries';
  const numEntries = eve.entries.length;

  let scheduler: any;

  if (eve.type === 'Single Round-Robin') {
    scheduler = robin(numEntries);
  }

  if (eve.type === 'Double Round-Robin') {
    scheduler = [...robin(numEntries), ...robin(numEntries)];
  }

  scheduler.forEach((matchRef: number[], matchdayIdx: number) => {
    const matchday = matchdayIdx + 1;
    // Why can I not use array of numbers here
    matchRef.forEach(async (players: any) => {
      // Why can I not assign them to type score
      let home;
      let away;

      if (eve.type === 'Single Round-Robin' && eve.entries) {
        // Here I would like to indicate that home should have type score but it gives me an error if I try
        // We need to adjust indexes because robin library starts with 1
        home = {
          user: eve.entries[players[0] - 1],
          score: 0,
          points: 0,
        };
        away = {
          user: eve.entries[players[1] - 1],
          score: 0,
          points: 0,
        };
      }

      // Create first and second lag if its a double round robin format
      if (eve.type === 'Double Round-Robin' && eve.entries) {
        home = {
          user:
            matchday <= (scheduler.length + 1) / 2
              ? eve.entries[players[0] - 1]
              : eve.entries[players[1] - 1],
          score: 0,
          points: 0,
        };
        away = {
          user:
            matchday <= (scheduler.length + 1) / 2
              ? eve.entries[players[1] - 1]
              : eve.entries[players[0] - 1],
          score: 0,
          points: 0,
        };
      }

      const match: MatchInterface = {
        owner: eve.owner,
        matchday: matchday,
        home: home,
        away: away,
        eventId: eve.eventId,
        started: false,
      };

      // Save Individual Matches to Match document
      await saveMatch(match, eve.eventId);
      await updateEvent(eve.eventId, 'started', true);
    });
  });
};

export const deleteEntry = async (
  eventId: string | undefined,
  uid: string | undefined
) => {
  const eventToUpdate = doc(firestore, `events/${eventId}`);
  try {
    await runTransaction(firestore, async (transaction) => {
      const eventDoc = await transaction.get(eventToUpdate);
      if (!eventDoc.exists()) throw 'Tournament does not exist!';
      const data = eventDoc.data();
      const newEntries = data.entries.filter(
        (entry: UserInterface) => entry.uid !== uid
      );
      transaction.update(eventToUpdate, { ...data, entries: newEntries });
    });
  } catch (err) {
    console.log('Transaction failed: ', err);
  }
};

export const updateEvent = async (
  eventId: string | undefined,
  updateField: string,
  updateValue: any
) => {
  const eventToUpdate = doc(firestore, `events/${eventId}`);

  try {
    await runTransaction(firestore, async (transaction) => {
      const eventDoc = await transaction.get(eventToUpdate);
      if (!eventDoc.exists()) throw 'Tournament does not exist!';
      const data = eventDoc.data();

      transaction.update(eventToUpdate, {
        ...data,
        [updateField]: updateValue,
      });
    });
  } catch (err) {
    console.log('Transaction failed: ', err);
  }
};

export const updateStandings = async (
  eventId: string | undefined,
  matchId: string | undefined,
  homePointsDiff: number,
  homeScoreDiff: number,
  awayPointsDiff: number,
  awayScoreDiff: number,
  gamesDiff: number
) => {
  const standingToUpdate = doc(firestore, `standings/${eventId}`);
  try {
    await runTransaction(firestore, async (transaction) => {
      const standingDoc = await transaction.get(standingToUpdate);
      if (!standingDoc.exists()) throw 'Standing does not exist!';
      const standingData = standingDoc.data();
      const matchData = await getMatch(matchId);

      const standingToKeep = standingDoc
        .data()
        .standing.filter(
          (player: any) =>
            player.user.uid !== matchData?.home.user.uid &&
            player.user.uid !== matchData?.away.user.uid
        );

      const standingHome = standingDoc.data().standing.filter((player: any) => {
        return player.user.uid === matchData?.home.user.uid;
      })[0];

      const standingAway = standingDoc.data().standing.filter((player: any) => {
        return player.user.uid === matchData?.away.user.uid;
      })[0];

      const totalPointsHomeNew = standingHome.totalPoints + homePointsDiff;
      const totalScoredHomeNew = standingHome.totalScored + homeScoreDiff;
      const totalConcededHomeNew = standingHome.totalConceded + awayScoreDiff;
      const totalGamesHomeNew = standingHome.totalPlayed + gamesDiff;

      const totalPointsAwayNew = standingAway.totalPoints + awayPointsDiff;
      const totalScoredAwayNew = standingAway.totalScored + awayScoreDiff;
      const totalConcededAwayNew = standingAway.totalConceded + homeScoreDiff;
      const totalGamesAwayNew = standingAway.totalPlayed + gamesDiff;

      const standingHomeNew = {
        ...standingHome,
        totalPoints: totalPointsHomeNew,
        totalScored: totalScoredHomeNew,
        totalConceded: totalConcededHomeNew,
        totalPlayed: totalGamesHomeNew,
      };

      const standingAwayNew = {
        ...standingAway,
        totalPoints: totalPointsAwayNew,
        totalScored: totalScoredAwayNew,
        totalConceded: totalConcededAwayNew,
        totalPlayed: totalGamesAwayNew,
      };

      const newStanding = [...standingToKeep, standingHomeNew, standingAwayNew];

      transaction.update(standingToUpdate, {
        ...standingData,
        standing: newStanding,
      });
    });
  } catch (err) {
    console.log('Transaction failed: ', err);
  }
};

const calcPoints = (
  score1: number | string | undefined,
  score2: number | string | undefined
) => {
  if (!score2 || score2 === '-') return 3;
  if (!score1) return 0;
  if (score1 > score2) return 3;
  if (score1 === score2) return 1;
  else return 0;
};

// Update Match
export const updateMatch = async (
  eventId: string | undefined,
  matchId: string | undefined,
  homeScoreNew: number,
  awayScoreNew: number
) => {
  const matchToUpdate = doc(firestore, `matches/${matchId}`);

  try {
    await runTransaction(firestore, async (transaction) => {
      const matchDoc = await transaction.get(matchToUpdate);
      if (!matchDoc.exists()) throw 'Match does not exist!';

      const data = matchDoc.data();

      const homePointsOld = data.home.points;
      const awayPointsOld = data.away.points;

      const homePointsNew = calcPoints(homeScoreNew, awayScoreNew);
      const awayPointsNew = calcPoints(awayScoreNew, homeScoreNew);

      const gamesDiff = !data.started ? 1 : 0;

      const homePointsDiff = homePointsNew - homePointsOld;
      const awayPointsDiff = awayPointsNew - awayPointsOld;

      const homeScoreDiff = homeScoreNew - data.home.score;
      const awayScoreDiff = awayScoreNew - data.away.score;

      const newHome = {
        ...data.home,
        score: homeScoreNew,
        points: homePointsNew,
        started: true,
      };
      const newAway = {
        ...data.away,
        score: awayScoreNew,
        points: awayPointsNew,
        started: true,
      };

      transaction.update(matchToUpdate, {
        started: true,
        home: newHome,
        away: newAway,
      });

      updateStandings(
        eventId,
        matchId,
        homePointsDiff,
        homeScoreDiff,
        awayPointsDiff,
        awayScoreDiff,
        gamesDiff
      );
    });
  } catch (e) {
    console.log('Transaction failed: ', e);
  }
};

//
export const endTournament = async (eventId: string | undefined) => {
  // update Tournament
  // await updateEvent(eventId, 'completed', true);

  const eventDoc = doc(firestore, `events/${eventId}`);
  updateDoc(eventDoc, { completed: true });

  const standingDoc = doc(firestore, `standings/${eventId}`);
  updateDoc(standingDoc, { completed: true });
};
