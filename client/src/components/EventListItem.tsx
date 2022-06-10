import { FC, useState, useContext, useEffect } from 'react';
import { EventInterface, MatchInterface } from '../types/types';
import {
  Box,
  Button,
  Stack,
  Text,
  Avatar,
  Badge,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
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
        {eve.completed && <Badge colorScheme='gray'>Done</Badge>}
        {eve.started && <Badge colorScheme='yellow'>Started</Badge>}
        {!eve.started && !eve.completed && (
          <Badge colorScheme='green'>Open</Badge>
        )}
      </Box>

      <Text fontSize={['sm', 'sm', 'sm', 'md', '2xl']} fontWeight='bold'>
        {eve.title}
      </Text>

      <Text fontSize={['xs', 'xs', 'xs', 'xs', 'md']}>{eve.venue}</Text>
      <Text fontSize={['xs', 'xs', 'xs', 'xs', 'md']}>
        {moment(eve.date).format('YYYY-MM-DD')}
      </Text>

      <Tag mt={5} size='md' colorScheme='purple' borderRadius='full'>
        <Avatar
          src={eve.owner.avatar}
          size='xs'
          name={eve.owner.username}
          ml={-1}
          mr={2}
        />
        <TagLabel>{eve.owner.username}</TagLabel>
      </Tag>

      <Box mt={2}>
        {eve.entries.map((entry: any) => {
          return (
            <Tag
              size='sm'
              key={entry.uid}
              borderRadius='full'
              variant='subtle'
              colorScheme='green'
            >
              <TagLabel>{entry.username}</TagLabel>
              <TagCloseButton />
            </Tag>
          );
        })}
      </Box>

      <Stack direction='row' spacing={4} align='left'>
        <Button size='xs' onClick={() => addPlayer(eve.eventId)}>
          Sign Up
        </Button>
        {!eve.started && (
          <Button size='xs' onClick={() => createSchedule(eve)}>
            Start Event
          </Button>
        )}

        <Button size='xs' onClick={() => updateCurrent(eve)}>
          Details
        </Button>
      </Stack>
    </Box>
  );
};

export default EventListItem;
