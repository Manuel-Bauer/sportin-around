import { FC } from 'react';
import { eve, match } from '../types/types';
import { Box, Text, VStack } from '@chakra-ui/react';
import Match from '../components/Match';

interface Props {
  currentEvent: eve | undefined;
}

const EventDetails: FC<Props> = ({ currentEvent }) => {
  return (
    <Box mx='auto'>
      {currentEvent && <Text fontSize='3xl'>{currentEvent?.title}</Text>}
      <VStack>
        {currentEvent?.matches &&
          currentEvent?.matches.map((match: match) => {
            return <Match match={match} />;
          })}
      </VStack>
    </Box>
  );
};

export default EventDetails;
