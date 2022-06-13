import { FC } from 'react';
import { EventInterface } from '../types/types';
import {
  Box,
  Text,
  Avatar,
  Flex,
  Tag,
  TagLabel,
  Button,
  useToast,
  Badge,
  Image,
  TagCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {
  PlusSquareIcon,
  ExternalLinkIcon,
  RepeatClockIcon,
} from '@chakra-ui/icons';
import moment from 'moment';
import { addPlayer, createSchedule, deleteEntry } from '../utils/firestore';
import Transition from './Transition';
import pin from '../assets/pin.svg';
import clock from '../assets/clock.svg';
import { getFirebase } from '../firebase';

const { auth } = getFirebase();

interface Props {
  eve: EventInterface;
  updateCurrent: Function;
}

const NextEvent: FC<Props> = ({ eve, updateCurrent }) => {
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

  const handleStartTournament = async (eve: EventInterface) => {
    toast({
      title: `${eve.title} has started. See schedule in the tournament details.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    createSchedule(eve);
  };

  const handleShowDetails = async (eve: EventInterface) => {
    await updateCurrent(eve);
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

  return (
    <Box
      backgroundColor='gray.50'
      px={5}
      py={5}
      shadow='base'
      position='relative'
    >
      <Image
        position='absolute'
        shadow='lg'
        top={10}
        right={5}
        boxSize='135px'
        objectFit='cover'
        src={
          eve.image ||
          'https://img.freepik.com/free-vector/tournament-sports-league-logo-emblem_1366-202.jpg?w=2000'
        }
      />

      <Text mb={2} fontSize='3xl' color='black' fontWeight='bold'>
        Upcoming: {eve.title}
      </Text>
      {eve.completed && (
        <Badge fontSize='lg' backgroundColor='gray.800' color='white' size='lg'>
          Done
        </Badge>
      )}
      {eve.started && !eve.completed && (
        <Badge colorScheme='green' fontSize='lg'>
          Ongoing
        </Badge>
      )}
      {!eve.started && !eve.completed && (
        <Badge colorScheme='yellow' fontSize='lg'>
          Open for registration
        </Badge>
      )}

      <Flex mt={3} alignItems='center' gap={2}>
        <Image src={pin} boxSize='25px'></Image>
        <Text fontSize='lg' color='black'>
          {eve.venue}
        </Text>
      </Flex>

      <Flex gap={2} alignItems='center' mt={1}>
        <Image src={clock} boxSize='25px'></Image>
        <Text fontSize='lg' color='black'>
          {moment(eve.date).format('YYYY-MM-DD')}
        </Text>
      </Flex>

      <Flex w='100%'>
        <Tag mt={5} size='lg' colorScheme='purple' borderRadius='full'>
          <Avatar
            src={eve.owner.avatar}
            ml={-3}
            mr={2}
            size='md'
            name={eve.owner.username}
          />
          <TagLabel fontWeight='bold' fontSize='lg' paddingX={1}>
            {auth.currentUser.uid === eve.owner.uid
              ? 'You are Admin'
              : eve.owner.username}
          </TagLabel>
        </Tag>
      </Flex>

      <Text mt={2} ml={2} fontSize='md'>
        {eve.entries.length === 0
          ? 'No entries yet.'
          : `${eve.entries.length} player${
              eve.entries.length === 1 ? '' : 's'
            } signed up`}
      </Text>

      <Flex gap={2} flexWrap='wrap'>
        {eve.entries.map((entry) => {
          return (
            <Tag mt={2} size='sm' colorScheme='green' borderRadius='full'>
              <Avatar
                src={entry.avatar}
                size='sm'
                name={entry.username}
                ml={-2}
                mr={2}
              />
              <TagLabel
                fontSize='md'
                fontWeight={
                  entry.uid === auth.currentUser.uid ? 'bold' : 'none'
                }
                paddingX={1}
              >
                {entry.username}
              </TagLabel>
              {!eve.started && (
                <TagCloseButton
                  onClick={() => handleRemoveMe(eve.eventId, entry.uid)}
                />
              )}
            </Tag>
          );
        })}
      </Flex>

      {eve.started && (
        <Button
          mt={6}
          leftIcon={<ExternalLinkIcon />}
          border='1px'
          colorScheme='twitter'
          variant='solid'
          onClick={() => handleShowDetails(eve)}
          size='md'
        >
          Schedule
        </Button>
      )}

      <Flex mt={5} gap={3}>
        {!eve.started && (
          <Button
            leftIcon={<PlusSquareIcon />}
            colorScheme='twitter'
            size='sm'
            onClick={() => handleAddMe(eve.eventId)}
            variant='solid'
            border='1px'
          >
            Add Me
          </Button>
        )}

        {!eve.started && eve.owner.uid === auth.currentUser.uid && (
          <>
            <Button
              leftIcon={<RepeatClockIcon />}
              onClick={onOpen}
              colorScheme='twitter'
              size='sm'
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
      </Flex>
    </Box>
  );
};

export default NextEvent;
