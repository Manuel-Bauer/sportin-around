import { Client } from '@googlemaps/google-maps-services-js';

const axios = require('axios');

const GOOGLE_MAPS_API_KEY = 'AIzaSyBAHS6021cR4O50-mdY4ITqJDjtqOm6a1w';

// https://maps.googleapis.com/maps/api/place/autocomplete/output?parameters
const base_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/';

const config = {
  method: 'get',
  url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=amoeba&types=establishment&location=37.76999%2C-122.44696&radius=500&key=${GOOGLE_MAPS_API_KEY}`,
  headers: {},
};

export const autocompleteLocation = async () => {
  axios(config)
    .then((response: any) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error: any) => {
      console.log(error);
    });
};
