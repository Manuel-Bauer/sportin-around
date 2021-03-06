import { MatchInterface, EventInterface } from '../types/types';
import { FC } from 'react';
import { getFirebase } from '../firebase';

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
import { updateMatch } from '../utils/firestore';

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
      backgroundColor={
        eve.completed ? 'gray.300' : match.started ? 'green.50' : 'gray.50'
      }
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
        <Flex justify='center' align='center' h='100%' w='100%'>
          <Editable
            textAlign='center'
            w={6}
            minH={6}
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
            <Flex justify='center'>
              <EditablePreview
                backgroundColor={
                  eve.completed
                    ? 'black'
                    : match.started
                    ? 'green.100'
                    : 'gray.200'
                }
                w={6}
                minH={6}
                color={
                  eve.completed ? 'gray.300' : match.started ? 'black' : 'gray'
                }
                padding={1}
                fontStyle={match.started ? 'normal' : 'italic'}
              />
            </Flex>
            <Flex justify='center'>
              <EditableInput
                alignSelf='center'
                w={6}
                minH={6}
                backgroundColor='gray.400'
                borderColor='black'
              />
            </Flex>
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
            textAlign='center'
            w={6}
            minH={6}
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
            <EditablePreview
              backgroundColor={
                eve.completed
                  ? 'black'
                  : match.started
                  ? 'green.100'
                  : 'gray.200'
              }
              w='100%'
              color={
                eve.completed ? 'gray.300' : match.started ? 'black' : 'gray'
              }
              padding={1}
              fontStyle={match.started ? 'normal' : 'italic'}
            />
            <EditableInput
              alignSelf='center'
              w={6}
              minH={6}
              backgroundColor='gray.400'
              borderColor='black'
            />
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
          <Avatar w={5} maxH={5} mr={2} src={match?.away?.user.avatar} />
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default Match;
