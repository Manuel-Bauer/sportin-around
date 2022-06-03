import { ChakraProvider, Box } from '@chakra-ui/react';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import { useState } from 'react';
import { getFirebase } from './firebase';

const { auth } = getFirebase();

export const App = () => {
  const [authed, setAuthed] = useState(false);

  return (
    <ChakraProvider>
      <Box>
        {!auth.currentUser ? (
          <SignIn setAuthed={setAuthed} />
        ) : (
          <SignOut setAuthed={setAuthed} />
        )}
        <h1>{auth.currentUser?.email}</h1>
      </Box>
    </ChakraProvider>
  );
};
