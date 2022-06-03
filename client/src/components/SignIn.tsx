import { Button, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { getFirebase } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const { auth } = getFirebase();

export default function SignIn(): any {
  const signInWIthGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <Box>
      <Button colorScheme='blue' onClick={signInWIthGoogle}>
        Sign in with Google
      </Button>
      <div>Current User</div>
    </Box>
  );
}
