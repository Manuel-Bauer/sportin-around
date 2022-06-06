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
import { updateMatch } from '../utils/firestore';

const { firestore } = getFirebase();

interface Props {
  match: MatchInterface;
}

const Match: FC<Props> = ({ match }) => {
  const [homeProfile, setHomeProfile] = useState<any>({});
  const [awayProfile, setAwayProfile] = useState<any>({});

  useEffect(() => {
    const userDocHome = doc(firestore, `users/${match?.home?.uid}`);
    const userDocAway = doc(firestore, `users/${match?.away?.uid}`);
    onSnapshot(userDocHome, (snapshot) => {
      setHomeProfile(snapshot.data());
    });
    onSnapshot(userDocAway, (snapshot) => {
      setAwayProfile(snapshot.data());
    });
  }, []);

  return (
    <Flex w='100%' justify='space-between'>
      <Flex>
        <Text>{homeProfile.username}</Text>
        <Editable
          onChange={(value) =>
            updateMatch(match.matchId, Number(value), 'home', match.eventId)
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
          updateMatch(match.matchId, Number(value), 'away', match.eventId)
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

// Get Userprofile by ID
