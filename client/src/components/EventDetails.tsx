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
  Badge,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { nanoid } from 'nanoid';
import Match from '../components/Match';
import { getFirebase } from '../firebase';
import Standings from './Standings';
import { getUser } from '../utils/firestore';

const { firestore } = getFirebase();

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
    <Box>
      <Grid mt={5} templateColumns='repeat(8, 1fr)' gap='20px'>
        <GridItem colSpan={4}>
          <Flex
            justify='center'
            align='center'
            bgColor='gray.100'
            shadow='base'
          >
            <ChevronLeftIcon onClick={() => prevMatchday()} />
            <Text mx={5} align='center'>
              Matchday {matchday}
            </Text>
            <ChevronRightIcon onClick={() => nextMatchday()} />
          </Flex>

          <VStack mt={3}>
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
          </VStack>
        </GridItem>
        <GridItem colSpan={4}>
          {currentStandings && (
            <Standings
              entries={currentEvent.entries}
              standings={currentStandings}
            />
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default EventDetails;
