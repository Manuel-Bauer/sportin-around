import { FC, useRef } from 'react';
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
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { ExternalLinkIcon, SmallAddIcon, CheckIcon } from '@chakra-ui/icons';
import { addPlayer, createSchedule, deleteEntry } from '../utils/firestore';
import { isUserSignedUp } from '../utils/helpers';
import { getFirebase } from '../firebase';
import moment from 'moment';
import WalkthroughPopover from './WalkthroughPopover';
import * as Scroll from 'react-scroll';

const ScrollElement = Scroll.Element;
const scroller = Scroll.scroller;
const scroll = Scroll.animateScroll;

const { auth } = getFirebase();

interface Props {
  eve: EventInterface;
  updateCurrent: Function;
  current: {
    eve: EventInterface;
    matches: MatchInterface[];
    standings: StandingsInterface;
  };
  scrollToTop: Function;
  first: boolean;
}

const EventListItem: FC<Props> = ({
  eve,
  updateCurrent,
  current,
  scrollToTop,
}) => {
  const handleShowDetails = async (eve: EventInterface) => {
    scrollToTop();
    scroll.scrollToTop();
    await updateCurrent(eve);
  };

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
        {eve.completed && (
          <Badge backgroundColor='gray.800' color='white'>
            Done
          </Badge>
        )}
        {eve.started && !eve.completed && <Badge colorScheme='green'>On</Badge>}
        {!eve.started && !eve.completed && (
          <Badge colorScheme='yellow'>Open</Badge>
        )}
      </Box>
      <ScrollElement name='test1'></ScrollElement>

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
            onClick={() => handleShowDetails(eve)}
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
