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
    homeScore: any,
    awayScore: any
  ) => {
    try {
      // post Match and Standings to Database
      await updateMatch(eventId, matchId, homeScore, awayScore);
      // get current from database
      await updateCurrent(eve);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid
      mt={3}
      minW='100%'
      templateColumns='repeat(23, 1fr )'
      fontSize={['sm', 'sm', 'sm', 'sm', 'md']}
    >
      <GridItem colSpan={2}>
        <Flex align='center' h='100%' w='100%' justify='start'>
          <Avatar w={5} maxH={5} ml={2} src={match?.home?.user.avatar} />
        </Flex>
      </GridItem>
      <GridItem colSpan={8}>
        <Flex align='center' justify='end' w='100%' h='100%'>
          <Text
            align='center'
            fontWeight={
              auth.currentUser.uid === match.home?.user.uid ? 'bold' : 'normal'
            }
            mr={3}
          >
            {match?.home?.user.username}
          </Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex justify='center' align='center' h='100%'>
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
        </Flex>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex justify='center' align='center' h='100%'>
          <Text>:</Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={1}>
        <Flex align='center' justify='center' h='100%'>
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
        </Flex>
      </GridItem>
      <GridItem colSpan={8}>
        <Flex align='center' justify='start' w='100%' h='100%'>
          <Text
            fontWeight={
              auth.currentUser.uid === match.away?.user.uid ? 'bold' : 'normal'
            }
            ml={3}
          >
            {match?.away?.user.username}
          </Text>
        </Flex>
      </GridItem>
      <GridItem colSpan={2}>
        <Flex align='center' h='100%' w='100%' justify='end'>
          <Avatar w={5} maxH={5} ml={2} src={match?.away?.user.avatar} />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Match;
