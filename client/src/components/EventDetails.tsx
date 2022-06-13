import { FC, useEffect, useState } from 'react';
import {
  EventInterface,
  MatchInterface,
  StandingsInterface,
} from '../types/types';
import { Box, Text, Grid, GridItem, Flex, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, LockIcon } from '@chakra-ui/icons';
import { nanoid } from 'nanoid';
import Match from '../components/Match';
import Standings from './Standings';
import { saveTournamentStandings } from '../utils/firestore';
import WalkthroughPopover from './WalkthroughPopover';


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

  const lockTournamentHandler = (eventId: string | undefined) => {
    saveTournamentStandings(currentEvent.eventId);
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
      <Flex
        justify={currentEvent.completed ? 'space-between' : 'end'}
        align='center'
      >
        {currentEvent.completed && (
          <Flex>
            <Text fontSize='3xl' fontStyle='italic' ml={3}>
              Tournament is finished
            </Text>
          </Flex>
        )}

        <Flex justify='end' align='center' mt={5} mr={5} pb='20px'>
          <WalkthroughPopover
            popoverStyles={{ placement: 'bottom', closeOnBlur: false }}
            triggerText='Lock Tournament Result'
            triggerStyles={{
              leftIcon: <LockIcon />,
              border: '1px',
              size: 'sm',
            }}
            popoverContentStyles={{
              color: 'white',
              bg: 'twitter.800',
              borderColor: 'blue.800',
            }}
            popoverHeaderStyles={{ pt: '4px', fontWeight: 'bold', border: '0' }}
            popoverHeaderText='Lock Tournament Result'
            popoverBodyText="Do you want to lock the tournament and save the result? Match scores can't be edited after this."
            popoverFooterStyles={{
              border: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: '4px',
            }}
            buttonGroupStyles={{ size: 'sm' }}
            buttonStyles={{
              colorScheme: 'twitter',
              onClick: () => lockTournamentHandler(currentEvent.eventId),
            }}
            buttonText='Lock Tournament'
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default EventDetails;
