import { ChakraProvider, Box } from '@chakra-ui/react';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import { useState } from 'react';

export const App = () => {
  const [currentUser, setCurrentUser] = useState({
    uid: '',
    email: '',
    displayName: '',
  });

  return (
    <ChakraProvider>
      <Box>
        {!currentUser.uid && <SignIn setCurrentUser={setCurrentUser} />}
        <h1>{currentUser.displayName}</h1>
        <SignOut />
      </Box>
    </ChakraProvider>
  );
};
