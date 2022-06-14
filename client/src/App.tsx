import { useEffect, useState } from 'react';
import { getFirebase } from './firebase';
import {
  ChakraProvider,
  Button,
  Grid,
  GridItem,
  Box,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import SignIn from './components/SignIn';
import EventForm from './components/EventForm';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import Header from './components/Header';
import NextEvent from './components/NextEvent';
import { FC } from 'react';
import { EventInterface } from './types/types';
import theme from './theme';
import {
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { sortEventListDate } from './utils/helpers';
import goobyLogoWhiteCut from './assets/goobyLogoWhiteCut.png';

const { auth, firestore } = getFirebase();

export const App: FC = () => {
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEventPreview, setShowEventPreview] = useState(true);
  // If I not use any it says: Argument of type 'DocumentData[]' is not assignable to parameter of type 'SetStateAction<undefined>'. How to deal with that within typescript react?
  const [eves, setEves] = useState<any>();
  const [nextEvent, setNextEvent] = useState<any>();
  const [current, setCurrent] = useState<any>({});
  const [preventInitialRender, setPreventInitialRender] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Load all existing Events on initial render
  useEffect(() => {
    getAllEvents();
    onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else setCurrentUser(null);
    });
    setPreventInitialRender((prev) => (prev += 1));
  }, []);

  console.log(auth.currentUser);

  const getAllEvents = () => {
    const eventsCol = collection(firestore, 'events');
    onSnapshot(eventsCol, (snapshot) => {
      const data = snapshot.docs.map((d: any) => {
        return {
          ...d.data(),
          eventId: d.id,
        };
      });
      setEves(data);
      setNextEvent(
        sortEventListDate(
          data.filter((eve: any) => new Date(eve.date).valueOf() > Date.now())
        )[0]
      );
    });
  };

  const updateCurrent = async (eve: EventInterface) => {
    const matchesCol = collection(firestore, 'matches');
    const matchQuery = query(matchesCol, where('eventId', '==', eve.eventId));

    // Again document data issue
    const matches: any = [];
    const matchSnapshot = await getDocs(matchQuery);
    matchSnapshot.forEach((doc) => {
      matches.push({ ...doc.data(), matchId: doc.id });
    });

    const standingsCol = collection(firestore, 'standings');
    const standingsQuery = query(
      standingsCol,
      where('eventId', '==', eve.eventId)
    );

    let standings: any = {};
    const standingsSnapshot = await getDocs(standingsQuery);
    standingsSnapshot.forEach((doc) => {
      standings = doc.data();
    });

    setCurrent({ matches, eve, standings });
    setShowEventDetails(true);
  };

  const handleCreateTournament = () => {
    setShowEventForm((prev) => {
      return !prev;
    });
    onOpen();
  };

  return (
    <ChakraProvider theme={theme}>
      {!currentUser && <SignIn setAuthed={setAuthed} />}
      {currentUser && (
        <Box position='relative'>
          <Header setAuthed={setAuthed} currentUser={currentUser} />
          <EventForm onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
          <Grid
            style={{ zIndex: '0' }}
            m='20px'
            templateColumns='repeat(12, 1fr)'
            gap='20px'
          >
            <GridItem colSpan={3}>
              <Button
                leftIcon={<AddIcon />}
                backgroundColor='gray.300'
                color='black'
                size='md'
                w='100%'
                mb={5}
                onClick={() => handleCreateTournament()}
              >
                Create Tournament
              </Button>

              <EventList
                eves={eves}
                current={current}
                updateCurrent={updateCurrent}
                showEventDetails={showEventDetails}
              />
            </GridItem>
            <GridItem colStart={4} colEnd={13}>
              {showEventDetails ? (
                <EventDetails
                  currentEvent={current.eve}
                  currentMatches={current.matches}
                  currentStandings={current.standings}
                  updateCurrent={updateCurrent}
                  setShowEventDetails={setShowEventDetails}
                />
              ) : (
                eves &&
                eves?.length > 0 && (
                  <NextEvent updateCurrent={updateCurrent} eve={nextEvent} />
                )
              )}
            </GridItem>
          </Grid>
        </Box>
      )}
    </ChakraProvider>
  );
};
