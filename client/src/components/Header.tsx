import { FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Avatar, Image } from '@chakra-ui/react';
import SignOut from '../components/SignOut';
import goobyLogoBlue from '../assets/goobyLogoBlue.png';

interface Props {
  setAuthed: Function;
  currentUser: any;
}

const Header: FC<Props> = ({ setAuthed, currentUser }) => {
  return (
    <Flex
      mx='auto'
      bg='twitter.500'
      h={50}
      align='center'
      paddingX='20px'
      justify='space-between'
    >
      <Flex align='center'>
        <Avatar
          width={8}
          maxH={8}
          name={currentUser.displayName}
          src={currentUser.photoURL}
        />
        <Text ml={2} color='white' fontWeight='bold'>
          {currentUser.displayName}
        </Text>
      </Flex>

      <Image boxSize='50px' src={goobyLogoBlue}></Image>

      <SignOut setAuthed={setAuthed} />
    </Flex>
  );
};

export default Header;
