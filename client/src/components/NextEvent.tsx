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
  Image,
} from '@chakra-ui/react';
import { SmallAddIcon, CheckIcon } from '@chakra-ui/icons';
import moment from 'moment';
import { addPlayer, createSchedule } from '../utils/firestore';
import WalkthroughPopover from './WalkthroughPopover';

interface Props {
  eve: EventInterface;
}

const NextEvent: FC<Props> = ({ eve }) => {
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
    <Box backgroundColor='gray.50' px={5} shadow='base'>
      <Text fontSize='3xl' fontStyle='italic' color='black' fontWeight='bold'>
        Upcoming Tournament
      </Text>
      <Flex align='center' gap={10}>
        <Text mt={5} fontSize='3xl' color='black' fontWeight='bold'>
          {eve.title}
        </Text>

        <Tag mt={5} size='md' colorScheme='purple' borderRadius='full'>
          <Avatar
            src={eve.owner.avatar}
            ml={-2}
            mr={2}
            size='md'
            name={eve.owner.username}
          />
          <TagLabel
            fontStyle='italic'
            fontWeight='bold'
            fontSize='lg'
            paddingX={2}
          >
            {eve.owner.username}
          </TagLabel>
        </Tag>
      </Flex>

      <Text mt={-2} fontSize='lg' color='black'>
        {eve.venue}
      </Text>
      <Text fontSize='md' color='black'>
        {moment(eve.date).format('YYYY-MM-DD')}
      </Text>

      <Text fontSize='md' color='black'></Text>

      <Flex gap={2}>
        {eve.entries.map((entry) => {
          return (
            <Tag mt={5} size='sm' colorScheme='green' borderRadius='full'>
              <Avatar
                src={entry.avatar}
                size='sm'
                name={entry.username}
                ml={-2}
                mr={2}
              />
              <TagLabel fontStyle='italic' paddingX={1}>
                {entry.username}
              </TagLabel>
            </Tag>
          );
        })}
      </Flex>

      <Button
        leftIcon={<SmallAddIcon />}
        colorScheme='gray'
        size='sm'
        onClick={() => handleAddMe(eve.eventId)}
        variant='solid'
        border='1px'
      >
        Add me
      </Button>
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
          onClick: () => handleStartTournament(eve),
        }}
        buttonText='Start Tournament'
      />
    </Box>
  );
};

export default NextEvent;
