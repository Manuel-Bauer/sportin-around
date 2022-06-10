import { FC, useState, useContext, useEffect } from 'react';
import {
  EventInterface,
  MatchInterface,
  StandingsInterface,
} from '../types/types';
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
  IconButton,
} from '@chakra-ui/react';
import { ExternalLinkIcon, SmallAddIcon, CheckIcon } from '@chakra-ui/icons';
import { addPlayer, createSchedule, deleteEntry } from '../utils/firestore';
import { isUserSignedUp } from '../utils/helpers';
import { getFirebase } from '../firebase';
import moment from 'moment';
import WalkthroughPopover from './WalkthroughPopover';

const { auth } = getFirebase();

interface Props {
  eve: EventInterface;
  updateCurrent: Function;
  current: {
    eve: EventInterface;
    matches: MatchInterface[];
    standings: StandingsInterface;
  };
}

const EventListItem: FC<Props> = ({ eve, updateCurrent, current }) => {
  console.log(eve.eventId);
  console.log(current?.eve?.eventId);

  return (
    <Box
      bgColor='gray.100'
      boxShadow='base'
      mb={3}
      p={2}
      position='relative'
      border={eve.eventId === current?.eve?.eventId ? '2px' : 'none'}
      borderColor='twitter.800'
    >
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
        <TagLabel>
          {isUserSignedUp(eve, auth.currentUser.uid)
            ? 'You are Admin'
            : eve.owner.username}
        </TagLabel>
      </Tag>

      <Box mt={2}>
        {eve.entries.map((entry: any) => {
          if (entry.uid === auth.currentUser.uid) {
            return (
              <Tag
                size='sm'
                key={entry.uid}
                borderRadius='full'
                variant='subtle'
                colorScheme='green'
                fontWeight='bold'
              >
                <TagLabel>{entry.username}</TagLabel>
                {!eve.started && (
                  <TagCloseButton
                    onClick={() => deleteEntry(eve.eventId, entry.uid)}
                  />
                )}
              </Tag>
            );
          }
          if (eve.owner.uid === auth.currentUser.uid) {
            return (
              <Tag
                size='sm'
                key={entry.uid}
                borderRadius='full'
                variant='subtle'
                colorScheme='green'
              >
                <TagLabel>{entry.username}</TagLabel>
                {!eve.started && (
                  <TagCloseButton
                    onClick={() => deleteEntry(eve.eventId, entry.uid)}
                  />
                )}
              </Tag>
            );
          } else {
            return (
              <Tag
                size='sm'
                key={entry.uid}
                borderRadius='full'
                variant='subtle'
                colorScheme='green'
              >
                <TagLabel>{entry.username}</TagLabel>
              </Tag>
            );
          }
        })}
      </Box>

      <Stack mt={4} direction='row' spacing={4} align='left'>
        {!eve.started && !isUserSignedUp(eve, auth.currentUser.uid) && (
          <Button
            leftIcon={<SmallAddIcon />}
            colorScheme='gray'
            size='sm'
            onClick={() => addPlayer(eve.eventId)}
            variant='solid'
            border='1px'
          >
            Add me
          </Button>
        )}

        {eve.started && (
          <Button
            leftIcon={<ExternalLinkIcon />}
            border='1px'
            colorScheme='gray'
            variant='solid'
            onClick={() => updateCurrent(eve)}
            size='sm'
          >
            Details
          </Button>
        )}
        {!eve.started && eve.owner.uid === auth.currentUser.uid && (
          <WalkthroughPopover
            popoverStyles={{ placement: 'right', closeOnBlur: false }}
            triggerText='Start'
            triggerStyles={{
              leftIcon: <CheckIcon />,
              border: '1px',
              size: 'sm',
            }}
            popoverContentStyles={{
              color: 'white',
              bg: 'twitter.800',
              borderColor: 'blue.800',
            }}
            popoverHeaderStyles={{ pt: '4px', fontWeight: 'bold', border: '0' }}
            popoverHeaderText='Start the Tournament'
            popoverBodyText="After the tournament has been started, the schedule is created and users won't be able to sign up anymore."
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
              onClick: () => createSchedule(eve),
            }}
            buttonText='Start Tournament'
          />
        )}
      </Stack>
    </Box>
  );
};

export default EventListItem;
