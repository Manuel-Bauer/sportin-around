import { FC } from 'react';

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Avatar,
} from '@chakra-ui/react';
import { StandingsInterface, UserInterface } from '../types/types';
import { sortStandings } from '../utils/helpers';
import { getFirebase } from '../firebase';

const { auth } = getFirebase();

interface Props {
  standings: StandingsInterface;
}

const Standings: FC<Props> = ({ standings }) => {
  return (
    <TableContainer>
      <Table size={['sm', 'sm', 'sm', 'sm', 'md']} variant='striped'>
        <Thead>
          <Tr>
            <Th>Player</Th>
            <Th>G</Th>
            <Th>+/-</Th>
            <Th>P</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortStandings(standings.standing).map((player) => {
            return (
              <Tr
                key={player.user.uid}
                fontWeight={
                  player.user.uid === auth.currentUser.uid ? 'bold' : 'normal'
                }
              >
                <Td>
                  {
                    <Avatar
                      width={[3, 3, 3, 5, 7]}
                      maxH={[3, 3, 3, 5, 7]}
                      src={player.user.avatar}
                    />
                  }
                  {'  '}
                  {player.user.username}
                </Td>
                <Td isNumeric>{player.totalPlayed}</Td>
                <Td isNumeric>{player.totalScored - player.totalConceded}</Td>
                <Td isNumeric>{player.totalPoints}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Standings;
