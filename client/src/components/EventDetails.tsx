import { FC, useEffect, useState, useContext } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import { Box, Text, VStack } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import Match from '../components/Match';
import { getFirebase } from '../firebase';

interface Props {
  currentEvent: EventInterface;
  currentMatches: MatchInterface[];
}

const EventDetails: FC<Props> = ({ currentEvent, currentMatches }) => {
  return (
    <Box mx='auto'>
      <Text fontSize='3xl'>{currentEvent?.title}</Text>
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
