import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        black: '#010400',
        white: '#FFFCF9',
        blue: {
            50: '#ECEBFA',
            100: '#C9C7F0',
            200: '#A6A3E6',
            300: '#847EDC',
            400: '#615AD3',
            500: '#3E36C9',
            600: '#322BA1',
            700: '#252178',
            800: '#191650',
            900: '#0C0B28',
        },
        altblue: {
            50: '#ECEBFA',
            100: '#C9C7F0',
            200: '#A6A3E6',
            300: '#847FDC',
            400: '#615BD2',
            500: '#3E37C8',
            600: '#322CA0',
            700: '#252178',
            800: '#191650',
            900: '#0C0B28',
        },
        purple: {
            50: '#F1E7FD',
            100: '#D9BCFB',
            200: '#C191F8',
            300: '#A866F5',
            400: '#903AF2',
            500: '#770FF0',
            600: '#5F0CC0',
            700: '#480990',
            800: '#300660',
            900: '#180330',
        },
        gray: {
            50: '#F3F0F4',
            100: '#DCD6E1',
            200: '#C6BCCD',
            300: '#AFA1B9',
            400: '#9987A6',
            500: '#836D92',
            600: '#685775',
            700: '#4E4158',
            800: '#342C3A',
            900: '#1A161D',
        },
    },
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
    },
});

export default theme;
