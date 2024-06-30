import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: '#6C63FF',
    secondary: '#FF6347',
  },
  fonts: {},
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
  },
  components: {
    Button: {
      variants: {
        ghost: {
          borderWidth: '0',
          outline: '0',
          boxShadow: 'none',
          _hover: {
            textDecoration: 'underline',
          },
          _focus: {
            borderWidth: '0',
            outline: '0',
            boxShadow: 'none',
          },
          _active: {
            borderWidth: '0',
            outline: '0',
            boxShadow: 'none',
          },
        },
        link: {
          borderWidth: '0',
          outline: '0',
          boxShadow: 'none',
          _hover: {
            textDecoration: 'underline',
          },
          _focus: {
            borderWidth: '0',
            outline: '0',
            boxShadow: 'none',
          },
          _active: {
            borderWidth: '0',
            outline: '0',
            boxShadow: 'none',
          },
        },
      },
    },
  },
});

export default theme;
