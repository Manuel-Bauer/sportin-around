import { useState } from 'react';
import { getFirebase } from './firebase';
import { ChakraProvider } from '@chakra-ui/react';

import SignIn from './components/SignIn';

import SignOut from './components/SignOut';
import EventForm from './components/EventForm';

const { auth } = getFirebase();

export const App = () => {
  const [authed, setAuthed] = useState(false);
  return (
    <ChakraProvider>
      {!auth.currentUser ? (
        <SignIn setAuthed={setAuthed} />
      ) : (
        <SignOut setAuthed={setAuthed} />
      )}
      {auth.currentUser && <h1>{auth.currentUser.email}</h1>}
      {auth.currentUser && <EventForm />}
    </ChakraProvider>
  );
};
