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
  Grid,
  GridItem,
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
  };

  return (
    <Grid
      templateColumns='repeat(2, 1fr)'
      fontSize={['sm', 'sm', 'sm', 'sm', 'md']}
    >
      <GridItem>
        <Flex justify='end' align='center'>
          <Text mr={3}>{homeProfile.username}</Text>
          <Editable
            onSubmit={(value) =>
              update(match.matchId, Number(value), 'home', match.eventId)
            }
            defaultValue={match?.home?.score.toString()}
          >
            <EditablePreview />
            <EditableInput w={[2, 2, 2, 3, 5]} />
          </Editable>
          <Text>:</Text>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex justify='start' align='center'>
          <Editable
            onSubmit={(value) =>
              update(match.matchId, Number(value), 'away', match.eventId)
            }
            defaultValue={match?.away?.score.toString()}
          >
            <EditablePreview />
            <EditableInput w={[2, 2, 2, 3, 5]} />
          </Editable>
          <Text ml={3}>{awayProfile.username}</Text>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Match;
