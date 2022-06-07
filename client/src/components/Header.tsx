import { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { getFirebase } from '../firebase';

const { auth } = getFirebase();

// Flexbox
// Logo on the left
// Title in the center
// Avatar on the left

const Header: FC = () => {
  return (
    <Flex
      mx='auto'
      bg='twitter.500'
      h={50}
      align='center'
      paddingX={6}
      justify='flex-end'
    >
      <Avatar
        width={8}
        height='auto'
        name='Might Guy'
        src={auth?.currentUser?.photoURL}
      />
    </Flex>
  );
};

export default Header;
