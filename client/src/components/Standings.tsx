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
import { StandingsInterface } from '../types/types';
import { sortStandings } from '../utils/helpers';

interface Props {
  standings: StandingsInterface;
}

const Standings: FC<Props> = ({ standings }) => {
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
                <Td>playerName</Td>
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
