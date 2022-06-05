import { FC } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import { Box, Text, VStack } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import Match from '../components/Match';

interface Props {
  currentEvent: EventInterface | undefined;
}

const EventDetails: FC<Props> = ({ currentEvent }) => {
  return (
    <Box mx='auto'>
      {currentEvent && <Text fontSize='3xl'>{currentEvent?.title}</Text>}
      <VStack>
        {currentEvent?.matches &&
          currentEvent?.matches.map((match: MatchInterface) => {
            return <Match key={nanoid()} match={match} />;
          })}
      </VStack>
    </Box>
  );
};

export default EventDetails;
