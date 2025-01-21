import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'teal',
      },
    },
    Tag: {
      defaultProps: {
        colorScheme: 'teal',
      },
    },
  },
});

export default theme; 