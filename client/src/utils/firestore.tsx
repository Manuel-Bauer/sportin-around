import { getFirebase } from '../firebase';
import { doc, updateDoc, runTransaction, setDoc } from 'firebase/firestore';
import { MatchInterface, EventInterface } from '../types/types';
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

  const newResult: any = {
    uid: auth.currentUser.uid,
    totalPoints: 0,
    totalScored: 0,
    totalConceded: 0,
    rank: 0,
  };

  try {
    await runTransaction(firestore, async (transaction) => {
      const eventDoc = await transaction.get(thisEvent);
      if (!eventDoc.exists()) throw 'Event does not exist!';

      const data = eventDoc.data();

      const result = !data.result ? [newResult] : [...data.result, newResult];

      transaction.update(thisEvent, { result });
    });
  } catch (e) {
    console.log('Transaction failed: ', e);
  }
};

// Add match to event. Called in create Schedule
const saveMatches = async (
  matches: MatchInterface[],
  eventId: String | undefined
) => {
  console.log('saveMatches', eventId);
  const matchesDoc = doc(firestore, `matches/${eventId}`);
  setDoc(matchesDoc, { matches });
};

// Creates schedule based on signed up participant for Event and if it is single round robin or double round robin
export const createSchedule = (eve: EventInterface) => {
  if (!eve.result) throw 'Must have at least two entries';
  const numEntries = eve.result.length;

  let scheduler: any;

  if (eve.type === 'Single Round-Robin') {
    scheduler = robin(numEntries);
  }

  if (eve.type === 'Double Round-Robin') {
    scheduler = [...robin(numEntries), ...robin(numEntries)];
  }

  const matches: MatchInterface[] = [];

  scheduler.forEach((matchRef: number[], matchdayIdx: number) => {
    const matchday = matchdayIdx + 1;
    // Why can I not use array of numbers here
    matchRef.forEach(async (players: any) => {
      // Why can I not assign them to type score
      let home;
      let away;

      if (eve.type === 'Single Round-Robin' && eve.result) {
        // Here I would like to indicate that home should have type score but it gives me an error if I try
        // We need to adjust indexes because robin library starts with 1
        home = {
          uid: eve.result[players[0] - 1].uid,
          score: 0,
          points: 0,
        };
        away = {
          uid: eve.result[players[1] - 1].uid,
          score: 0,
          points: 0,
        };
      }

      // Create first and second lag if its a double round robin format
      if (eve.type === 'Double Round-Robin' && eve.result) {
        home = {
          uid:
            matchday <= (scheduler.length + 1) / 2
              ? eve.result[players[0] - 1].uid
              : eve.result[players[1] - 1].uid,
          score: 0,
          points: 0,
        };
        away = {
          uid:
            matchday <= (scheduler.length + 1) / 2
              ? eve.result[players[1] - 1].uid
              : eve.result[players[0] - 1].uid,
          score: 0,
          points: 0,
        };
      }

      const match: MatchInterface = {
        matchId: nanoid(),
        ownerId: eve.ownerId,
        matchday: matchday,
        home: home,
        away: away,
        eventId: eve.eventId,
      };

      matches.push(match);

      await saveMatches(matches, eve.eventId);
    });
  });
};
