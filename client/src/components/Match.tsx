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

const { firestore } = getFirebase();

interface Props {
  match: MatchInterface;
  setMatches: Function;
}

const Match: FC<Props> = ({ match, setMatches }) => {
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

  // Side is home or away
  const updateScore = (newValue: number, side: string) => {
    console.log('update');
  };

  return (
    <Flex w='100%' justify='space-between'>
      <Flex>
        <Text>{homeProfile.username}</Text>
        <Editable
          onChange={(value) => updateScore(Number(value), 'home')}
          defaultValue={match?.home?.score.toString()}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Flex>
      <Flex>{awayProfile.username}</Flex>
      <Editable defaultValue={match?.home?.score.toString()}>
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Flex>
  );
};

export default Match;

// Get Userprofile by ID
