import { FC, useEffect, useState } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import { Box, Text, VStack } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import Match from '../components/Match';
import { getFirebase } from '../firebase';

interface Props {
  currentEvent: EventInterface | undefined;
  currentMatches: MatchInterface[];
}

const EventDetails: FC<Props> = ({ currentEvent, currentMatches }) => {
  console.log('currentMATCHES', currentMatches);
  console.log(currentMatches?.length);
  return (
    <Box mx='auto'>
      {currentEvent && <Text fontSize='3xl'>{currentEvent?.title}</Text>}
      <VStack>
        {currentMatches?.length > 0 &&
          currentMatches.map((match: MatchInterface) => {
            return <Match key={nanoid()} match={match} />;
          })}
      </VStack>
    </Box>
  );
};

export default EventDetails;
