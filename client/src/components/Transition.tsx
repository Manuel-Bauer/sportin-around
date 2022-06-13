import { FC, useRef } from 'react';

import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';

import { EventInterface } from '../types/types';

interface Props {
  isOpen: any;
  onClose: any;
  handleStartTournament: any;
  eve: EventInterface;
}

const Transition: FC<Props> = ({
  isOpen,
  onClose,
  handleStartTournament,
  eve,
}) => {
  const cancelRef = useRef<any>();

  return (
    <>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Start Tournament?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Schedule will be created and no sign up possible subsequently.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              colorScheme='green'
              ml={3}
              onClick={() => handleStartTournament(eve)}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Transition;
