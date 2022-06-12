import { FC, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  VStack,
  Box,
  Heading,
  FormLabel,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Stack,
  Radio,
  RadioGroup,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { getFirebase } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { EventInterface } from '../types/types';

const { firestore, auth } = getFirebase();

interface Props {
  isOpen: any;
  onClose: any;
  onOpen: any;
}

const EventForm: FC<Props> = ({ isOpen, onClose, onOpen }) => {
  const btnRef = useRef();

  const formik = useFormik({
    initialValues: {
      title: '',
      venue: '',
      date: '',
      type: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title required')
        .min(6, 'Title is too short')
        .max(23, 'Title is too long'),
      venue: Yup.string()
        .required('Venue required')
        .min(6, 'Venue is too short')
        .max(23, 'Title is too long'),
      date: Yup.date().required('Date required'),
      type: Yup.string().required('Type required'),
    }),
    onSubmit: async (values: any, actions: any) => {
      // Use server side saving of IDs
      // Create Result array

      const newID = nanoid();

      // Works but you need to specify document name
      // For now: Client side ID generation
      const newDoc = doc(firestore, `events/${newID}`);

      const user = {
        username: auth.currentUser.displayName,
        stats: [],
        uid: auth.currentUser.uid,
        avatar: auth.currentUser.photoURL,
      };

      const newEvent: EventInterface = {
        title: values.title,
        venue: values.venue,
        owner: user,
        date: values.date,
        started: false,
        completed: false,
        type: values.type,
        entries: [],
      };

      setDoc(newDoc, newEvent);

      actions.resetForm();
    },
  });

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      // finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create new Tournament</DrawerHeader>

        <DrawerBody>
          <Box>
            <form onSubmit={formik.handleSubmit}>
              <VStack
              // mx='auto'
              // w={{ base: '90%', md: 300 }}
              // justifyContent='center'
              // h='100vh'
              >
                <FormControl
                  isInvalid={
                    formik.errors.title && formik.touched.title ? true : false
                  }
                >
                  <FormLabel>Title</FormLabel>
                  <Input
                    placeholder='Enter Title...'
                    {...formik.getFieldProps('title')}
                  ></Input>
                  <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    formik.errors.venue && formik.touched.venue ? true : false
                  }
                >
                  <FormLabel>Venue</FormLabel>
                  <Input
                    placeholder='Enter Venue...'
                    {...formik.getFieldProps('venue')}
                  ></Input>
                  <FormErrorMessage>{formik.errors.venue}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={
                    formik.errors.date && formik.touched.date ? true : false
                  }
                >
                  <FormLabel>Date</FormLabel>
                  <Input type='date' {...formik.getFieldProps('date')}></Input>
                  <FormErrorMessage>{formik.errors.date}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={
                    formik.errors.type && formik.touched.type ? true : false
                  }
                >
                  <FormLabel>Type</FormLabel>
                  <RadioGroup>
                    <Stack direction='column'>
                      <Radio
                        {...formik.getFieldProps('type')}
                        value='Single Round-Robin'
                      >
                        Single Round-Robin
                      </Radio>
                      <Radio
                        {...formik.getFieldProps('type')}
                        value='Double Round-Robin'
                      >
                        Double Round-Robin
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
                </FormControl>

                <Button type='submit' variant='outline'>
                  Create Event
                </Button>
              </VStack>
            </form>
          </Box>
        </DrawerBody>
        <DrawerFooter>
          <Button variant='outline' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='blue'>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default EventForm;
