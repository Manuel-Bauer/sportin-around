import { getFirebase } from '../firebase';
import {
  doc,
  updateDoc,
  runTransaction,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  Transaction,
} from 'firebase/firestore';
import {
  MatchInterface,
  EventInterface,
  ResultInterface,
  UserInterface,
} from '../types/types';
import { nanoid } from 'nanoid';

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
  console.log('createSchedule');

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
          uid: eve.entries[players[0] - 1].uid,
          score: 0,
          points: 0,
        };
        away = {
          uid: eve.entries[players[1] - 1].uid,
          score: 0,
          points: 0,
        };
      }

      // Create first and second lag if its a double round robin format
      if (eve.type === 'Double Round-Robin' && eve.entries) {
        home = {
          uid:
            matchday <= (scheduler.length + 1) / 2
              ? eve.entries[players[0] - 1].uid
              : eve.entries[players[1] - 1].uid,
          score: 0,
          points: 0,
        };
        away = {
          uid:
            matchday <= (scheduler.length + 1) / 2
              ? eve.entries[players[1] - 1].uid
              : eve.entries[players[0] - 1].uid,
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

export const updateStandings = async (eventId: string | undefined) => {
  const standingToUpdate = doc(firestore, `standings/${eventId}`);

  try {
    await runTransaction(firestore, async (transaction) => {
      const standingDoc = await transaction.get(standingToUpdate);
      if (!standingDoc.exists()) throw 'Standing does not exist!';
      const data = standingDoc.data();

      const newStanding = await data.standing.map(
        async (player: ResultInterface) => {
          let totalPlayed = 0;
          let totalPoints = 0;
          let totalScored = 0;
          let totalConceded = 0;
          let user = player.user;

          // Query through all matches with the given event id
          const matchesCol = collection(firestore, 'matches');
          const matchQuery = query(matchesCol, where('eventId', '==', eventId));
          const querySnapshot = await getDocs(matchQuery);

          querySnapshot.forEach((match: any) => {
            const data = match.data();
            if (
              (data.home.uid === user.uid || data.away.uid === user.uid) &&
              data.started
            ) {
              totalPlayed++;
            }
            if (data.home.uid === user.uid) {
              totalPoints += data.home.points;
              totalScored += data.home.score;
              totalConceded += data.away.score;
            }
            if (data.away.uid === user.uid) {
              totalPoints += data.away.points;
              totalScored += data.away.score;
              totalConceded += data.home.score;
            }
          });

          return {
            user,
            totalPlayed,
            totalPoints,
            totalScored,
            totalConceded,
          };
        }
      );

      return Promise.all(newStanding).then((values) => {
        transaction.update(standingToUpdate, { standing: values });
      });
    });
  } catch (err) {
    console.log('Transaction failed: ', err);
  }
};

const calcPoints = (score1: number, score2: number) => {
  if (score1 > score2) return 3;
  if (score1 === score2) return 1;
  else return 0;
};

// Update Match
export const updateMatch = async (
  matchId: string | undefined,
  score: number,
  side: string,
  eventId: string | undefined
) => {
  const matchToUpdate = doc(firestore, `matches/${matchId}`);

  try {
    await runTransaction(firestore, async (transaction) => {
      const matchDoc = await transaction.get(matchToUpdate);
      if (!matchDoc.exists()) throw 'Match does not exist!';

      const data = matchDoc.data();

      if (side === 'home') {
        const homePoints = calcPoints(score, data.away.score);
        const awayPoints = calcPoints(data.away.score, score);
        const newHome = { ...data.home, score: score, points: homePoints };
        const newAway = { ...data.away, points: awayPoints };
        transaction.update(matchToUpdate, {
          started: true,
          home: newHome,
          away: newAway,
        });
      }

      if (side === 'away') {
        const awayPoints = calcPoints(score, data.home.score);
        const homePoints = calcPoints(data.away.score, score);
        const newAway = { ...data.away, score: score, points: awayPoints };
        const newHome = { ...data.home, points: homePoints };
        transaction.update(matchToUpdate, {
          started: true,
          home: newHome,
          away: newAway,
        });
      }
    });
  } catch (e) {
    console.log('Transaction failed: ', e);
  }
};
