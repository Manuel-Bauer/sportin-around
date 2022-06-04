import { FC, useState } from 'react';
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
} from '@chakra-ui/react';
import { getFirebase } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

import { eve } from '../types/types';

const { firestore, auth } = getFirebase();

const EventForm: FC = () => {
  const formik = useFormik({
    initialValues: {
      title: '',
      venue: '',
      date: '',
      type: 'Single-Round-Robin',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title required')
        .min(6, 'Title is too short'),
      venue: Yup.string()
        .required('Venue required')
        .min(6, 'Venue is too short'),
      date: Yup.date().required('Date required'),
    }),
    onSubmit: async (values: any, actions: any) => {
      const newID = nanoid();

      // Works but you need to specify document name
      // For now: Client side ID generation
      const newDoc = doc(firestore, `events/${newID}`);
      const newEvent: eve = {
        title: values.title,
        venue: values.venue,
        ownerId: auth.currentUser.uid,
        date: values.date,
        started: false,
        completed: false,
        type: values.type,
      };

      setDoc(newDoc, newEvent);

      actions.resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack
        mx='auto'
        w={{ base: '90%', md: 500 }}
        justifyContent='center'
        h='100vh'
      >
        <Heading>Create New Event</Heading>
        <FormControl
          isInvalid={formik.errors.title && formik.touched.title ? true : false}
        >
          <FormLabel>Title</FormLabel>
          <Input
            placeholder='Enter Title...'
            {...formik.getFieldProps('title')}
          ></Input>
          <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={formik.errors.venue && formik.touched.venue ? true : false}
        >
          <FormLabel>Venue</FormLabel>
          <Input
            placeholder='Enter Venue...'
            {...formik.getFieldProps('venue')}
          ></Input>
          <FormErrorMessage>{formik.errors.venue}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={formik.errors.date && formik.touched.date ? true : false}
        >
          <FormLabel>Date</FormLabel>
          <Input type='date' {...formik.getFieldProps('date')}></Input>
          <FormErrorMessage>{formik.errors.date}</FormErrorMessage>
        </FormControl>
        <Button type='submit' variant='outline'>
          Create Event
        </Button>
      </VStack>
    </form>
  );
};

export default EventForm;
