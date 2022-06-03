import { Button, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { getFirebase } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';

const { auth } = getFirebase();

export default function SignIn(): any {
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  const signInWIthGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  onAuthStateChanged(auth, (user: any) => {
    setCurrentUserEmail(user.email);
  });

  return (
    <Box>
      <Button colorScheme='blue' onClick={signInWIthGoogle}>
        Sign in with Google
      </Button>
      <p>Current User</p>
      <p>{currentUserEmail}</p>
    </Box>
  );
}
