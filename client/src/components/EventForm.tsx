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

const EventForm: FC = () => {
  const formik = useFormik({
    initialValues: {
      title: '',
      venue: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title required')
        .min(6, 'Title is too short'),
      venue: Yup.string()
        .required('Venue required')
        .min(6, 'Venue is too short'),
    }),
    onSubmit: (values: any, actions: any) => {
      alert(JSON.stringify(values, null, 2));
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
        <Button type='submit' variant='outline'>
          Create Event
        </Button>
      </VStack>
    </form>
  );
};

export default EventForm;
