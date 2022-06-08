import { FC, useEffect, useState, useContext } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import { Box, Text, VStack } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import Match from '../components/Match';
import { getFirebase } from '../firebase';
import { MainContext } from '../App';

const EventDetails: FC = () => {
  const { currentEvent, currentMatches } = useContext(MainContext);

  return (
    <Box mx='auto'>
      <VStack>
        {currentEvent && <Text fontSize='3xl'>{currentEvent?.title}</Text>}
        {currentMatches?.length > 0 &&
          currentMatches.map((match: MatchInterface) => {
            return <Match key={nanoid()} match={match} />;
          })}
      </VStack>
    </Box>
  );
};

export default EventDetails;
