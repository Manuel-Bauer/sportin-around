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
  Flex,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ExternalLinkIcon,
  CheckIcon,
  PlusSquareIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons';
import { addPlayer, createSchedule, deleteEntry } from '../utils/firestore';
import { isUserSignedUp } from '../utils/helpers';
import { getFirebase } from '../firebase';
import moment from 'moment';
import WalkthroughPopover from './WalkthroughPopover';
import Transition from './Transition';
import { animateScroll as scroll } from 'react-scroll';
import clock from '../assets/clock.svg';
import pin from '../assets/pin.svg';

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
  showEventDetails: boolean;
}

const EventListItem: FC<Props> = ({
  eve,
  updateCurrent,
  current,
  scrollSidebar,
  showEventDetails,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleAddMe = async (eventId: string | undefined) => {
    if (eve.entries.map((entry) => entry.uid).includes(auth.currentUser.uid)) {
      toast({
        title: `Already signed up for ${eve.title}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await addPlayer(eventId);
    toast({
      title: `Signed up for ${eve.title}`,
      status: 'success',
      duration: 3000,
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
      duration: 3000,
      isClosable: true,
    });
  };

  const handleShowDetails = async (eve: EventInterface) => {
    scrollSidebar();
    scroll.scrollToTop();
    await updateCurrent(eve);
  };

  const handleStartTournament = async (eve: EventInterface) => {
    onClose();

    toast({
      title: `${eve.title} has started. See schedule in the tournament details.`,
      status: 'success',
      duration: 3000,
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
      border={
        eve.eventId === current?.eve?.eventId && showEventDetails
          ? '2px'
          : 'none'
      }
      borderColor='twitter.800'
      z-index='1'
    >
      <Box position='absolute' shadow='base' bottom={0} right={0}></Box>
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

      <Text fontSize={['sm', 'sm', 'sm', 'md', '2xl']} fontWeight='bold'>
        {eve.title}
      </Text>

      <Flex alignItems='center' gap={1} mt={1}>
        <Image src={pin} boxSize='15px'></Image>
        <Text fontSize={['xs', 'xs', 'xs', 'xs', 'md']}>
          {eve.venue.split(', ').slice(0, 2).join(', ')}
        </Text>
      </Flex>

      <Flex alignItems='center' gap={1}>
        <Image src={clock} boxSize='15px'></Image>
        <Text fontSize={['xs', 'xs', 'xs', 'xs', 'md']}>
          {moment(eve.date).format('YYYY-MM-DD')}
        </Text>
      </Flex>

      <Tag mt={5} size='md' colorScheme='purple' borderRadius='full'>
        <Avatar
          src={eve.owner.avatar}
          size='xs'
          name={eve.owner.username}
          ml={-2}
          mr={2}
        />
        <TagLabel>
          {auth.currentUser.uid === eve.owner.uid
            ? 'You are Admin'
            : eve.owner.username}
        </TagLabel>
      </Tag>

      <Text mt={2} ml={2} fontSize='xs' fontStyle='italic'>
        {eve.entries.length === 0
          ? 'No entries yet.'
          : `${eve.entries.length} players signed up`}
      </Text>

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
            Add Me
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
            {eve.completed ? 'Results' : 'Schedule'}
          </Button>
        )}
        {!eve.started && eve.owner.uid === auth.currentUser.uid && (
          <>
            <Button
              leftIcon={<RepeatClockIcon />}
              onClick={onOpen}
              colorScheme='twitter'
              size='xs'
            >
              Start
            </Button>
            <Transition
              isOpen={isOpen}
              onClose={onClose}
              handleStartTournament={handleStartTournament}
              eve={eve}
            />
          </>
        )}
      </Stack>
    </Box>
  );
};

export default EventListItem;
