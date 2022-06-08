import { useEffect, useState } from 'react';
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
import { EventInterface, MainContextInterface } from './types/types';
import theme from './theme';
import {
  onSnapshot,
  collection,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const { auth, firestore } = getFirebase();

export const App: FC = () => {
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  // If I not use any it says: Argument of type 'DocumentData[]' is not assignable to parameter of type 'SetStateAction<undefined>'. How to deal with that within typescript react?
  const [eves, setEves] = useState<any>();
  const [currentEvent, setCurrentEvent] = useState<any>();
  const [currentMatches, setCurrentMatches] = useState<any>({});

  // Set current User on auth change
  onAuthStateChanged(auth, (user) => {
    if (user) setCurrentUser(user);
    else setCurrentUser(null);
  });

  // Load all existing Events on initial render
  useEffect(() => {
    getAllEvents();
  }, []);

  useEffect(() => {
    console.log('useEffect', currentEvent);
  }, [currentEvent]);

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
    });
  };

  const updateCurrent = async (eve: EventInterface) => {
    // setCurrentEvent(eve);
    // console.log(eve);

    //updating current Matches

    const matchesCol = collection(firestore, 'matches');
    const matchQuery = query(matchesCol, where('eventId', '==', eve.eventId));

    // Again document data issue
    const matches: any = [];
    const querySnapshot = await getDocs(matchQuery);
    querySnapshot.forEach((doc) => {
      matches.push({ ...doc.data(), matchId: doc.id });
    });
    console.log(matches);
    setCurrentMatches({ matches, eve });
  };

  return (
    <ChakraProvider theme={theme}>
      {!currentUser && <SignIn setAuthed={setAuthed} />}
      {currentUser && (
        <Box>
          <Header setAuthed={setAuthed} />
          <Grid m='20px' templateColumns='repeat(12, 1fr)' gap='20px'>
            <GridItem colSpan={3}>
              <EventList eves={eves} updateCurrent={updateCurrent} />
            </GridItem>
            <GridItem colStart={5} colEnd={13}>
              {currentMatches && (
                <EventDetails
                  currentEvent={currentMatches.eve}
                  currentMatches={currentMatches.matches}
                />
              )}
            </GridItem>
          </Grid>
        </Box>
      )}

      <Button onClick={() => setShowEventForm((prev) => !prev)}>
        Create new Event
      </Button>
    </ChakraProvider>
  );
};
