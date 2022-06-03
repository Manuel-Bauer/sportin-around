import { Button, Image, Flex } from '@chakra-ui/react';
import { getFirebase } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import googleLogo from '../assets/google.svg';
import { FC } from 'react';

interface props {
  setCurrentUser: Function;
}

const { auth } = getFirebase();

const SignIn: FC<props> = (props) => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  onAuthStateChanged(auth, (user: any) => {
    props.setCurrentUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });
  });

  return (
    <Flex h='100vh' justify='center' align='center'>
      <Button
        leftIcon={<Image h={4} src={googleLogo} alt='Google Logo' />}
        colorScheme='gray'
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </Button>
    </Flex>
  );
};

export default SignIn;
