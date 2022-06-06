import { getFirebase } from '../firebase';
import {
  doc,
  updateDoc,
  runTransaction,
  setDoc,
  collection,
  addDoc,
} from 'firebase/firestore';
import { MatchInterface, EventInterface, ResultInterface} from '../types/types';
import { nanoid } from 'nanoid';

const robin = require('roundrobin');

const { auth, firestore } = getFirebase();

// Add User to Firestore on first login. Again: How to add Firebase types
export const addUser = () => {
  const user = auth.currentUser;
  const userDoc = doc(firestore, `users/${user.uid}`);
  const newUser = {
    uid: user.uid,
    username: user.displayName,
    avatar: '',
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

      const newEntries = data.entries
        ? [...data.entries, auth.currentUser.uid]
        : [auth.currentUser.uid];

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
  const results = eve.entries.map((entry) => {
    return {
      uid: entry,
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
          uid: eve.entries[players[0] - 1],
          score: 0,
          points: 0,
        };
        away = {
          uid: eve.entries[players[1] - 1],
          score: 0,
          points: 0,
        };
      }

      // Create first and second lag if its a double round robin format
      if (eve.type === 'Double Round-Robin' && eve.entries) {
        home = {
          uid:
            matchday <= (scheduler.length + 1) / 2
              ? eve.entries[players[0] - 1]
              : eve.entries[players[1] - 1],
          score: 0,
          points: 0,
        };
        away = {
          uid:
            matchday <= (scheduler.length + 1) / 2
              ? eve.entries[players[1] - 1]
              : eve.entries[players[0] - 1],
          score: 0,
          points: 0,
        };
      }

      const match: MatchInterface = {
        ownerId: eve.ownerId,
        matchday: matchday,
        home: home,
        away: away,
        eventId: eve.eventId,
        started: false,
      };

      // Save Individual Matches to Match document
      await saveMatch(match, eve.eventId)
    });
  });
};

const updateStandings = async (eventId: string | undefined) => {

  const standingToUpdate = doc(firestore, `events/${eventId}`);

  try {
    await runTransaction(firestore, async (transaction) => {
      const standingDoc = await transaction.get(standingToUpdate)
      if(!standingDoc.exists()) throw "Event does not exist!"
      const data = standingDoc.data()

      

      const newStanding = data.standing.map((player: ResultInterface) => {
        // Loop through all the matches and whereever player.id === home.id or away.id add up the points 
      })
    })
  }


  // get standing by id
  // try {
  //   await runTransaction(firestore, async (transaction) => {
  //     const eventDoc = await transaction.get(thisEvent);
  //     if (!eventDoc.exists()) throw 'Event does not exist!';
  //     const data = eventDoc.data();
  //     const newEntries = data.entries
  //       ? [...data.entries, auth.currentUser.uid]
  //       : [auth.currentUser.uid];
  //     transaction.update(thisEvent, { entries: newEntries });
  //   });
  // } catch (e) {
  //   console.log('Transaction failed: ', e);
  // }
};

const calcPoints = (score1: number, score2: number) => {
  if (score1 > score2) return 3;
  else if (score1 === score2) return 1;
  else return 0;
};

// Update Match
export const updateMatch = async (
  matchId: string | undefined,
  score: number,
  side: string,
  eventId: string | undefined
) => {
  // Difference in standings

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
        const awayPoints = calcPoints(score, data.away.score);
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
