import { FC, useContext } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { getFirebase } from '../firebase';
import SignOut from '../components/SignOut';

const { auth } = getFirebase();

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
      <Avatar
        width={8}
        maxH={8}
        name={currentUser.displayName}
        src={currentUser.photoURL}
      />

      <SignOut setAuthed={setAuthed} />
    </Flex>
  );
};

export default Header;
