import { FC, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  VStack,
  Box,
  Flex,
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
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { getFirebase } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getUser } from '../utils/firestore';
import { nanoid } from 'nanoid';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

import { EventInterface } from '../types/types';

const { firestore, auth } = getFirebase();

interface Props {
  isOpen: any;
  onClose: any;
  onOpen: any;
}

const EventForm: FC<Props> = ({ isOpen, onClose, onOpen }) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  useEffect(() => {
    getUser(auth.currentUser.uid).then((res): any => setUserProfile(res));
  }, []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleInput = (e: any) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: any) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();
    };

  const renderSuggestions = () => {
    return (
      <UnorderedList
        p={3}
        minW='200px'
        styleType='none'
        position='fixed'
        top='210px'
        left='290px'
        background='gray.50'
        color='black'
        opacity='1'
      >
        {data.map((suggestion) => {
          const {
            place_id,
            structured_formatting: { main_text, secondary_text },
          } = suggestion;

          return (
            <ListItem p={1} key={place_id} onClick={handleSelect(suggestion)}>
              {main_text}-{secondary_text}
            </ListItem>
          );
        })}
      </UnorderedList>
    );
  };

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      title: '',
      date: '',
      type: '',
      image: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title required')
        .min(6, 'Title is too short')
        .max(20, 'Title is too long'),
      date: Yup.date().required('Date required'),
      type: Yup.string().required('Type required'),
    }),
    onSubmit: async (values: any, actions: any) => {
      const newID = nanoid();
      const newDoc = doc(firestore, `events/${newID}`);

      const newEvent: EventInterface = {
        title: values.title,
        venue: value,
        owner: userProfile,
        date: values.date,
        started: false,
        completed: false,
        type: values.type,
        entries: [],
        image: values.image,
      };

      setDoc(newDoc, newEvent);

      actions.resetForm();

      toast({
        title: 'Tournament created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create new Tournament</DrawerHeader>

        <DrawerBody>
          <Box>
            <form onSubmit={formik.handleSubmit}>
              <VStack gap={3}>
                <FormControl
                  isInvalid={
                    formik.errors.title && formik.touched.title ? true : false
                  }
                >
                  <FormLabel>Title</FormLabel>
                  <Input
                    size='sm'
                    placeholder='Enter Title...'
                    {...formik.getFieldProps('title')}
                  ></Input>
                  <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <FormLabel>Venue</FormLabel>
                  <Input
                    size='sm'
                    placeholder='Enter Venue...'
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                  ></Input>
                  {status === 'OK' && <ul>{renderSuggestions()}</ul>}
                </FormControl>

                <FormControl
                  isInvalid={
                    formik.errors.date && formik.touched.date ? true : false
                  }
                >
                  <FormLabel>Date</FormLabel>
                  <Input
                    size='sm'
                    type='date'
                    {...formik.getFieldProps('date')}
                  ></Input>
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
                        size='sm'
                        {...formik.getFieldProps('type')}
                        value='Single Round-Robin'
                      >
                        Single Round-Robin
                      </Radio>
                      <Radio
                        size='sm'
                        {...formik.getFieldProps('type')}
                        value='Double Round-Robin'
                      >
                        Double Round-Robin
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <FormErrorMessage>{formik.errors.type}</FormErrorMessage>

                  <FormLabel>Image URL</FormLabel>
                  <Flex>
                    <Input
                      size='sm'
                      placeholder='Enter Image URL...'
                      {...formik.getFieldProps('image')}
                    ></Input>
                  </Flex>
                </FormControl>
              </VStack>

              <Flex mt={10} justify='end' align='start'>
                <Button
                  variant='outline'
                  colorScheme='twitter'
                  mr={3}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={onClose}
                  type='submit'
                  colorScheme='twitter'
                  variant='solid'
                >
                  Create Event
                </Button>
              </Flex>
            </form>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default EventForm;
