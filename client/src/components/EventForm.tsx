import { FC, useState } from 'react';
import { useFormik } from 'formik';
import {
  VStack,
  Box,
  Heading,
  FormLabel,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react';

const EventForm: FC = () => {
  const formik = useFormik({
    initialValues: {
      title: '',
      venue: '',
    },
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
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            name='title'
            placeholder='Enter Title...'
            onChange={formik.handleChange}
            value={formik.values.title}
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Venue</FormLabel>
          <Input
            name='venue'
            placeholder='Enter Venue...'
            onChange={formik.handleChange}
            value={formik.values.venue}
          ></Input>
        </FormControl>
        <Button type='submit' variant='outline'>
          Create Event
        </Button>
      </VStack>
    </form>
  );
};

export default EventForm;
