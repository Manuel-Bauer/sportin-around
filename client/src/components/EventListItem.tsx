import { FC } from 'react';
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
  useToast,
  Image,
  Flex,
} from '@chakra-ui/react';
import { ExternalLinkIcon, CheckIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { addPlayer, createSchedule, deleteEntry } from '../utils/firestore';
import { isUserSignedUp } from '../utils/helpers';
import { getFirebase } from '../firebase';
import moment from 'moment';
import WalkthroughPopover from './WalkthroughPopover';
import { animateScroll as scroll } from 'react-scroll';

const { auth } = getFirebase();

interface Props {
  eve: EventInterface;
  updateCurrent: Function;
  current: {
    eve: EventInterface;
    matches: MatchInterface[];
    standings: StandingsInterface;
  };
  scrollSidebar: Function;
  first: boolean;
}

const EventListItem: FC<Props> = ({
  eve,
  updateCurrent,
  current,
  scrollSidebar,
}) => {
  const toast = useToast();

  const handleAddMe = async (eventId: string | undefined) => {
    await addPlayer(eventId);
    toast({
      title: `Signed up for ${eve.title}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleRemoveMe = async (
    eventId: string | undefined,
    uid: string | undefined
  ) => {
    await deleteEntry(eventId, uid);
    toast({
      title: `Removed from ${eve.title}`,
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleShowDetails = async (eve: EventInterface) => {
    scrollSidebar();
    scroll.scrollToTop();
    await updateCurrent(eve);
  };

  const handleStartTournament = async (eve: EventInterface) => {
    toast({
      title: `${eve.title} has started. See schedule in the tournament details.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    createSchedule(eve);
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
      z-index='1'
    >
      <Box position='absolute' shadow='base' bottom={0} right={0}>
       
      </Box>
      <Box position='absolute' top={1} right={1}>
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

      <Flex>
        <Text fontSize={['sm', 'sm', 'sm', 'md', '2xl']} fontWeight='bold'>
          {eve.title}
        </Text>
      </Flex>

      <Text fontSize={['xs', 'xs', 'xs', 'xs', 'md']}>{eve.venue}</Text>
      <Text fontSize={['xs', 'xs', 'xs', 'xs', 'md']}>
        {moment(eve.date).format('YYYY-MM-DD')}
      </Text>

      <Tag mt={5} size='md' colorScheme='purple' borderRadius='full'>
        <Avatar
          src={eve.owner.avatar}
          size='xs'
          name={eve.owner.username}
          ml={-2}
          mr={2}
        />
        <TagLabel>
          {isUserSignedUp(eve, auth.currentUser.uid)
            ? 'You are Admin'
            : eve.owner.username}
        </TagLabel>
      </Tag>

      {eve.entries.length === 0 && (
        <Text mt={2} fontSize='xs' fontStyle='italic'>
          No entries yet.
        </Text>
      )}

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
                    onClick={() => handleRemoveMe(eve.eventId, entry.uid)}
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
                    onClick={() => handleRemoveMe(eve.eventId, entry.uid)}
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

      <Stack mt={4} direction='row' spacing={2} align='left'>
        {!eve.started && (
          <Button
            leftIcon={<PlusSquareIcon />}
            colorScheme='twitter'
            size='xs'
            onClick={() => handleAddMe(eve.eventId)}
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
            colorScheme='twitter'
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
              size: 'xs',
              colorScheme: 'twitter',
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
              onClick: () => handleStartTournament(eve),
            }}
            buttonText='Start Tournament'
          />
        )}
      </Stack>
    </Box>
  );
};

export default EventListItem;
