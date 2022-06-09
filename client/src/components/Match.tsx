import { MatchInterface, EventInterface } from '../types/types';
import { useState, useEffect, FC } from 'react';
import { getFirebase } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  Box,
  Flex,
  Text,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from '@chakra-ui/react';
import { updateMatch, updateStandings } from '../utils/firestore';

const { firestore } = getFirebase();

interface Props {
  match: MatchInterface;
  eve: EventInterface;
  updateCurrent: Function;
}

const Match: FC<Props> = ({ match, eve, updateCurrent }) => {
  const [homeProfile, setHomeProfile] = useState<any>({});
  const [awayProfile, setAwayProfile] = useState<any>({});

  const updateMatchProfiles = async () => {
    const userDocHome = doc(firestore, `users/${match?.home?.uid}`);
    const userDocAway = doc(firestore, `users/${match?.away?.uid}`);
    onSnapshot(userDocHome, (snapshot) => {
      setHomeProfile(snapshot.data());
    });
    onSnapshot(userDocAway, (snapshot) => {
      setAwayProfile(snapshot.data());
    });
  };

  useEffect(() => {
    updateMatchProfiles();
  }, []);

  console.log(match);

  const update = async (
    matchId: string | undefined,
    value: number,
    side: string,
    eventId: string | undefined
  ) => {
    try {
      // post Match and Standings to Database
      await updateMatch(matchId, value, side, eventId);
      await updateStandings(eventId);
      // get current from database
      await updateCurrent(eve);
    } catch (err) {
      console.log(err);
    }
    // post Match and Standings to Database

    // Get current from database

    // Update Match state. Not needed
    // updateMatchProfiles();
  };

  return (
    <Flex w='100%' justify='space-between'>
      <Flex>
        <Text>{homeProfile.username}</Text>
        <Editable
          onChange={(value) =>
            update(match.matchId, Number(value), 'home', match.eventId)
          }
          defaultValue={match?.home?.score.toString()}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Flex>
      <Flex>{awayProfile.username}</Flex>
      <Editable
        onChange={(value) =>
          update(match.matchId, Number(value), 'away', match.eventId)
        }
        defaultValue={match?.away?.score.toString()}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Flex>
  );
};

export default Match;
