import { Button, Image, Flex } from '@chakra-ui/react';
import { getFirebase } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import googleLogo from '../assets/google.svg';
import { FC } from 'react';
import { addUser } from '../utils/firestore';
import goobyLogo from '../assets/gooby-logo.png';

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
      <Flex h='100vh' direction='column' justify='center' align='center'>
        <Image boxSize='200px' src={goobyLogo}></Image>
        <Button
          leftIcon={<Image h={4} src={googleLogo} alt='Google Logo' />}
          colorScheme='gray'
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </Button>
      </Flex>
    </>
  );
};

export default SignIn;
