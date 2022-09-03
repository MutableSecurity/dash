import { Center, Spinner } from '@chakra-ui/react';

export function LoadingScreen(props) {
    return (
        <Center
            minH={'100vh'}
            minW={'100vh'}
            display={props.hide ? 'none' : 'flex'}
        >
            <Spinner size="xl" color="blue"></Spinner>
        </Center>
    );
}
