import { FC, useEffect, useState, useContext } from 'react';
import {
  EventInterface,
  MatchInterface,
  StandingsInterface,
} from '../types/types';
import {
  Box,
  Text,
  VStack,
  Grid,
  GridItem,
  Flex,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, LockIcon } from '@chakra-ui/icons';
import { nanoid } from 'nanoid';
import Match from '../components/Match';
import Standings from './Standings';
import { endTournament } from '../utils/firestore';

interface Props {
  currentEvent: EventInterface;
  currentMatches: MatchInterface[];
  currentStandings: StandingsInterface;
  updateCurrent: Function;
}

const EventDetails: FC<Props> = ({
  currentEvent,
  currentMatches,
  currentStandings,
  updateCurrent,
}) => {
  const [matchday, setMatchday] = useState(1);
  const [maxMatchday, setMaxMatchday] = useState(0);

  useEffect(() => {
    const max = currentMatches
      .map((match) => match.matchday)
      .sort((a, b) => b - a)[0];
    setMaxMatchday(max);
  }, []);

  const nextMatchday = () => {
    if (matchday < maxMatchday) setMatchday((prev) => prev + 1);
  };

  const prevMatchday = () => {
    if (matchday > 1) setMatchday((prev) => prev - 1);
  };

  return (
    <Box backgroundColor='white' boxShadow='sm'>
      <Grid templateColumns='repeat(8, 1fr)' gap='20px'>
        <GridItem colSpan={4}>
          <Flex
            justify='center'
            align='center'
            bgColor='gray.100'
            shadow='base'
            mb={5}
            h='40px'
          >
            <IconButton
              aria-label='Search database'
              icon={<ChevronLeftIcon />}
              onClick={() => prevMatchday()}
            />

            <Text mx={5} align='center'>
              Matchday {matchday}
            </Text>
            <IconButton
              aria-label='Search database'
              icon={<ChevronRightIcon />}
              onClick={() => nextMatchday()}
            />
          </Flex>

          {currentMatches?.length > 0 &&
            currentMatches
              .filter((match) => match.matchday === matchday)
              .map((match: MatchInterface) => {
                return (
                  
                    <Match
                      key={nanoid()}
                      match={match}
                      eve={currentEvent}
                      updateCurrent={updateCurrent}
                    />
                
                );
              })}
        </GridItem>

        <GridItem colSpan={4}>
          <Flex
            justify='center'
            align='center'
            h='40px'
            bgColor='gray.100'
            shadow='base'
            mb={5}
          >
            <Text mx={5}>Current Standings</Text>
          </Flex>

          {currentStandings && <Standings standings={currentStandings} />}
        </GridItem>
      </Grid>
      <Flex justify='end' align='center' mt={5} mr={5} pb='20px'>
        <Button
          leftIcon={<LockIcon />}
          border='1px'
          colorScheme='gray'
          variant='solid'
          onClick={() => endTournament(currentEvent.eventId)}
          size='sm'
        >
          Lock Tournament
        </Button>
      </Flex>
    </Box>
  );
};

export default EventDetails;
