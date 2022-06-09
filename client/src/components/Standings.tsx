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
} from '@chakra-ui/react';
import { StandingsInterface, UserInterface } from '../types/types';
import { sortStandings } from '../utils/helpers';

interface Props {
  standings: StandingsInterface;
  entries: UserInterface[];
}

const Standings: FC<Props> = ({ entries, standings }) => {
  return (
    <TableContainer>
      <Table>
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
              <Tr>
                <Td>{player.user.username}</Td>
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
