import { FC, useEffect, useState, useContext } from 'react';
import {
  EventInterface,
  MatchInterface,
  StandingsInterface,
} from '../types/types';
import { Box, Text, VStack, Grid, GridItem, Flex } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { nanoid } from 'nanoid';
import Match from '../components/Match';
import { getFirebase } from '../firebase';

interface Props {
  currentEvent: EventInterface;
  currentMatches: MatchInterface[];
  currentStandings: StandingsInterface;
}

const EventDetails: FC<Props> = ({
  currentEvent,
  currentMatches,
  currentStandings,
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
      <Text align='center' fontSize='3xl'>
        {currentEvent?.title}
      </Text>
      <Grid mt={5} templateColumns='repeat(8, 1fr)' gap='20px'>
        <GridItem colSpan={4}>
          <Flex justify='center' align='center'>
            <ChevronLeftIcon onClick={() => prevMatchday()} />
            <Text align='center'>
              Matchday {matchday} / {maxMatchday}
            </Text>
            <ChevronRightIcon onClick={() => nextMatchday()} />
          </Flex>

          <VStack mt={3}>
            {currentMatches?.length > 0 &&
              currentMatches
                .filter((match) => match.matchday === matchday)
                .map((match: MatchInterface) => {
                  return <Match key={nanoid()} match={match} />;
                })}
          </VStack>
        </GridItem>
        <GridItem>{currentStandings.eventId}</GridItem>
      </Grid>
    </Box>
  );
};

export default EventDetails;
