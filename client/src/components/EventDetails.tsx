import { FC, useEffect, useState } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import { Box, Text, VStack } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import Match from '../components/Match';
import { getFirebase } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const { firestore } = getFirebase();

interface Props {
  currentEvent: EventInterface | undefined;
}

const EventDetails: FC<Props> = ({ currentEvent }) => {
  const [matches, setMatches] = useState<any>();

  useEffect(() => {
    const matchDoc = doc(firestore, `matches/${currentEvent?.eventId}`);
    onSnapshot(matchDoc, (snapshot) => {
      console.log(snapshot.data());
      setMatches(snapshot.data());
    });
  });

  return (
    <Box mx='auto'>
      {currentEvent && <Text fontSize='3xl'>{currentEvent?.title}</Text>}
      <VStack>
        {matches?.length > 0 &&
          matches.map((match: MatchInterface) => {
            return (
              <Match key={nanoid()} match={match} setMatches={setMatches} />
            );
          })}
      </VStack>
    </Box>
  );
};

export default EventDetails;
