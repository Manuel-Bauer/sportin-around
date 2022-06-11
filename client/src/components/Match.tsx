import { MatchInterface, EventInterface } from '../types/types';
import { useState, useEffect, FC } from 'react';
import { getFirebase } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  Flex,
  Text,
  Editable,
  EditableInput,
  EditablePreview,
  Grid,
  GridItem,
  Avatar,
} from '@chakra-ui/react';
import { updateMatch, updateStandings } from '../utils/firestore';

const { auth } = getFirebase();

interface Props {
  match: MatchInterface;
  eve: EventInterface;
  updateCurrent: Function;
}

const Match: FC<Props> = ({ match, eve, updateCurrent }) => {
  const update = async (
    eventId: string | undefined,
    matchId: string | undefined,
    homeScore: number | string | undefined,
    awayScore: number | string | undefined
  ) => {
    try {
      // post Match and Standings to Database
      await updateMatch(matchId, homeScore, awayScore);
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
          <Avatar w={5} maxH={5} mr={2} src={match?.home?.user.avatar} />
          <Text
            fontWeight={
              auth.currentUser.uid === match.home?.user.uid ? 'bold' : 'normal'
            }
            mr={3}
          >
            {match?.home?.user.username}
          </Text>
          <Editable
            onSubmit={(value) =>
              update(
                match.eventId,
                match.matchId,
                Number(value),
                match?.away?.score
              )
            }
            defaultValue={match?.home?.score.toString()}
          >
            {' '}
            <EditablePreview w='100%' />
            <EditableInput backgroundColor='twitter.400' w={[2, 2, 2, 3, 5]} />
          </Editable>
          <Text>:</Text>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex justify='start' align='center'>
          <Editable
            onSubmit={(value) =>
              update(
                match.eventId,
                match.matchId,
                match?.home?.score,
                Number(value)
              )
            }
            defaultValue={match?.away?.score.toString()}
          >
            <EditablePreview />
            <EditableInput w={[2, 2, 2, 3, 5]} />
          </Editable>
          <Text
            fontWeight={
              auth.currentUser.uid === match.away?.user.uid ? 'bold' : 'normal'
            }
            ml={3}
          >
            {match?.away?.user.username}
          </Text>
          <Avatar w={5} maxH={5} ml={2} src={match?.away?.user.avatar} />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Match;
