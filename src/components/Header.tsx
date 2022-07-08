import { FC, useState, useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { Avatar, Image } from '@chakra-ui/react';
import SignOut from '../components/SignOut';
import { getUser } from '../utils/firestore';

interface Props {
  setAuthed: Function;
  currentUser: any;
}

const Header: FC<Props> = ({ setAuthed, currentUser }) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  useEffect(() => {
    getUser(currentUser.uid).then((res): any => setUserProfile(res));
  }, []);

  console.log(currentUser);
  console.log('header', userProfile);

  return (
    <Flex
      mx='auto'
      bg='TU.100'
      h={50}
      align='center'
      paddingX='20px'
      justify='space-between'
    >
      <Flex align='center'>
        <Avatar
          width={8}
          maxH={8}
          name={userProfile?.username || ''}
          src={userProfile?.avatar || ''}
        />
        <Text ml={2} color='white' fontWeight='bold'>
          {userProfile?.username || ''}
        </Text>
      </Flex>

      <SignOut setAuthed={setAuthed} />
    </Flex>
  );
};

export default Header;
