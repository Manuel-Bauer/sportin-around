import { Button, Image, Flex } from '@chakra-ui/react';
import { getFirebase } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import googleLogo from '../assets/google.svg';
import { FC } from 'react';
import { addUser } from '../utils/firestore';
import knptmLogo from '../assets/knptm-logo.jpg';

const { auth } = getFirebase();

interface props {
  setAuthed: Function;
}

const SignIn: FC<props> = ({ setAuthed }) => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await setAuthed(true);

    const { createdAt, lastLoginAt } = auth.currentUser.metadata;
    if (createdAt === lastLoginAt) addUser();
  };

  return (
    <>
      <Flex
        mt='100px'
        h='100vh'
        direction='column'
        justify='center'
        align='center'
      >
        <Button
          leftIcon={<Image h={4} src={googleLogo} alt='Google Logo' />}
          colorScheme='twitter'
          backgroundColor='TU.100'
          onClick={signInWithGoogle}
          color='white'
        >
          Sign in with Google
        </Button>
      </Flex>
    </>
  );
};

export default SignIn;
