import { MatchInterface } from '../types/types';
import { useState, useEffect, FC } from 'react';
import { getFirebase } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore'; 

const { firestore } = getFirebase();

interface Props {
  match: MatchInterface;
}

const Match: FC<Props> = ({ match }) => {
  const [homeProfile, setHomeProfile] = useState<any>({});
  const [awayProfile, setAwayProfile] = useState<any>({});

  useEffect(() => {
    const userDocHome = doc(firestore, `users/${match?.home?.uid}`);
    const userDocAway = doc(firestore, `users/${match?.away?.uid}`);
    onSnapshot(userDocHome, (snapshot) => {
      setHomeProfile(snapshot.data());
    });
    onSnapshot(userDocAway, (snapshot) => {
      setAwayProfile(snapshot.data());
    });
  }, []);

  return (
    <div>
      <div>{match?.away?.uid}</div>
      <div>{homeProfile.username}</div>
    </div>
  );
};

export default Match;

// Get Userprofile by ID
