import { extendTheme } from '@chakra-ui/react';

const fonts = {
  // heading: `'Open Sans', sans-serif`,
  // body: `'Raleway', sans-serif`,
};

const colors = {
  TU: {
    100: '#0065bd',
  },
};

const theme = extendTheme({ fonts, colors });

export default theme;
