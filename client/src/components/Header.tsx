import { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';

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
        src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1700&q=80'
      />
    </Flex>
  );
};

export default Header;
