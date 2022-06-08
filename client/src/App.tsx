import { useState } from 'react';
import { getFirebase } from './firebase';
import {
  ChakraProvider,
  Button,
  Flex,
  Grid,
  GridItem,
  Box,
} from '@chakra-ui/react';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import Header from './components/Header';
import { FC, useContext, createContext } from 'react';
import { EventInterface } from './types/types';
import theme from './theme';
import { onSnapshot, collection, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { auth, firestore } = getFirebase();

export const MainContext = createContext({});

export const App: FC = () => {
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  // If I not use any it says: Argument of type 'DocumentData[]' is not assignable to parameter of type 'SetStateAction<undefined>'. How to deal with that within typescript react?
  const [eves, setEves] = useState<any>();
  const [currentEvent, setCurrentEvent] = useState<any>();
  const [currentMatches, setCurrentMatches] = useState<any>();

  // Set current User on auth change
  onAuthStateChanged(auth, (user) => {
    if (user) setCurrentUser(user);
    else setCurrentUser(null);
  });

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

  console.log(currentUser);

  return (
    <ChakraProvider theme={theme}>
      <MainContext.Provider value={currentUser}>
        {!currentUser && <SignIn setAuthed={setAuthed} />}
        {currentUser && (
          <Box>
            <Header setAuthed={setAuthed} />
            <Grid m='20px' templateColumns='repeat(12, 1fr)' gap='20px'>
              <GridItem colSpan={3}>
                <EventList
                  eves={eves}
                  currentMatches={currentMatches}
                  setCurrentEvent={setCurrentEvent}
                  setCurrentMatches={setCurrentMatches}
                />
              </GridItem>
              <GridItem colStart={5} colEnd={13}>
                <EventDetails
                  currentEvent={currentEvent}
                  currentMatches={currentMatches}
                />
              </GridItem>
            </Grid>
          </Box>
        )}

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
      </MainContext.Provider>
    </ChakraProvider>
  );
};
