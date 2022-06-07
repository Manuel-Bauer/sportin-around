import { useState } from 'react';
import { getFirebase } from './firebase';
import { ChakraProvider, Button, Flex } from '@chakra-ui/react';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import Header from './components/Header';
import { FC } from 'react';
import { EventInterface } from './types/types';
import theme from './theme';
import { onSnapshot, collection, doc } from 'firebase/firestore';

const { auth, firestore } = getFirebase();

export const App: FC = () => {
  const [authed, setAuthed] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  // If I not use any it says: Argument of type 'DocumentData[]' is not assignable to parameter of type 'SetStateAction<undefined>'. How to deal with that within typescript react?
  const [eves, setEves] = useState<any>();
  const [currentEvent, setCurrentEvent] = useState<any>();
  const [currentMatches, setCurrentMatches] = useState<any>();

  // Get also IDs
  const getAllEvents = () => {
    const eventsCol = collection(firestore, 'events');
    onSnapshot(eventsCol, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        return {
          ...d.data(),
          eventId: d.id,
        };
      });
      setEves(data);
      setShowEventList(true);
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <Header />
      {!auth.currentUser ? (
        <SignIn setAuthed={setAuthed} />
      ) : (
        <SignOut setAuthed={setAuthed} />
      )}
      {auth.currentUser && <h1>{auth.currentUser.email}</h1>}
      <Button onClick={() => setShowEventForm((prev) => !prev)}>
        Create new Event
      </Button>
      {auth.currentUser && showEventForm && <EventForm />}
      <Button onClick={getAllEvents}>Show all Events</Button>
      <Flex>
        <EventList
          eves={eves}
          currentMatches={currentMatches}
          setCurrentEvent={setCurrentEvent}
          setCurrentMatches={setCurrentMatches}
        />
        <EventDetails
          currentEvent={currentEvent}
          currentMatches={currentMatches}
        />
      </Flex>
    </ChakraProvider>
  );
};
