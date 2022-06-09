import { FC, useState, useContext, useEffect } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import { Box, Button, Stack, Text, Avatar } from '@chakra-ui/react';
import { LockIcon, TimeIcon, UnlockIcon } from '@chakra-ui/icons';
import { addPlayer, createSchedule, getUser } from '../utils/firestore';
import { getFirebase } from '../firebase';
import moment from 'moment';

const { firestore } = getFirebase();

interface Props {
  eve: EventInterface;
  updateCurrent: Function;
}

const EventListItem: FC<Props> = ({ eve, updateCurrent }) => {
  return (
    <Box bgColor='gray.100' boxShadow='base' mb={3} p={2} position='relative'>
      <Box position='absolute' top='5px' right='5px'>
        {eve.completed && <LockIcon h='15px' />}
        {eve.started && <TimeIcon h='15px' />}
        {!eve.started && !eve.completed && <UnlockIcon h='15px' />}
      </Box>

      <Text fontSize={['sm', 'sm', 'sm', 'md', '2xl']} fontWeight='bold'>
        {eve.title}
      </Text>
      <Text fontSize={['xs', 'xs', 'xs', 'xs', 'md']}>{eve.venue}</Text>
      <Text fontSize={['xs', 'xs', 'xs', 'xs', 'md']}>
        {moment(eve.date).format('YYYY-MM-DD')}
      </Text>

      <Box mt={2}>
        {eve.entries.map((entry: any) => {
          return <Avatar width={3} maxH={3} />;
        })}
      </Box>

      <Stack direction='row' spacing={4} align='left'>
        <Button size='xs' onClick={() => addPlayer(eve.eventId)}>
          Compete
        </Button>
        <Button size='xs' onClick={() => createSchedule(eve)}>
          Start Event
        </Button>
        <Button size='xs' onClick={() => updateCurrent(eve)}>
          Details
        </Button>
      </Stack>
    </Box>
  );
};

export default EventListItem;
