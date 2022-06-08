import { FC, useEffect, useState, useContext } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import { Box, Text, VStack, Grid, GridItem, Flex } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { nanoid } from 'nanoid';
import Match from '../components/Match';
import { getFirebase } from '../firebase';

interface Props {
  currentEvent: EventInterface;
  currentMatches: MatchInterface[];
}

const EventDetails: FC<Props> = ({ currentEvent, currentMatches }) => {
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

  console.log(maxMatchday);

  return (
    <Box>
      <Text align='center' fontSize='3xl'>
        {currentEvent?.title}
      </Text>
      <Grid templateColumns='repeat(8, 1fr)' gap='20px'>
        <GridItem colSpan={4}>
          <Flex>
            <ArrowLeftIcon />
            <Text align='center'>Matchday {matchday}</Text>
            <ArrowRightIcon onClick={() => nextMatchday()} />
          </Flex>

          <VStack>
            {currentMatches?.length > 0 &&
              currentMatches
                .filter((match) => match.matchday === matchday)
                .map((match: MatchInterface) => {
                  return <Match key={nanoid()} match={match} />;
                })}
          </VStack>
        </GridItem>
        <GridItem>Standings</GridItem>
      </Grid>
    </Box>
  );
};

export default EventDetails;
