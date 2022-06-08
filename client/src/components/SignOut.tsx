import { getFirebase } from '../firebase';
import { FC } from 'react';
import { Button } from '@chakra-ui/react';

const { auth } = getFirebase();

interface props {
  setAuthed: Function;
}

const SignOut: FC<props> = ({ setAuthed }) => {
  const signOut = async () => {
    await auth.signOut();
    setAuthed(false);
  };

  return (
    <Button
      size='xs'
      colorScheme='gray'
      variant='outline'
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
};

export default SignOut;
