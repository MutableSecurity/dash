import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Image,
    Input,
    Stack,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth, signInWithEmailAndPassword } from '../../utilities/auth';

import logo from '../../assets/logo.svg';
import './Login.css';

export default function SplitScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                const user = userCredential.user;

                toast({
                    title: 'Welcome back!',
                    description:
                        'We will redirect you to the dashboard in a moment.',
                    status: 'success',
                    duration: 2000,
                    isClosable: false,
                });

                setTimeout(() => {
                    navigate('/overview');
                }, 3000);
            })
            .catch(error => {
                toast({
                    title: 'There is an issue..',
                    description:
                        'Sorry, the email and password you entered do not match. Please try again.',
                    status: 'error',
                    duration: 4000,
                    isClosable: false,
                });
            });
    };

    return (
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={10} w={'full'} maxW={'md'}>
                    <Stack
                        spacing={4}
                        w={'full'}
                        maxW={'md'}
                        align="center"
                        justify="center"
                    >
                        <Image src={logo} className="logo" />
                        <Heading fontSize={'2xl'} textAlign="center">
                            Sign in to MutableSecurity
                        </Heading>
                    </Stack>
                    <Stack spacing={4} w={'full'} maxW={'md'}>
                        <FormControl id="email">
                            <FormLabel>Email Address</FormLabel>
                            <Input
                                type="email"
                                onChange={event =>
                                    setEmail(event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                onChange={event =>
                                    setPassword(event.currentTarget.value)
                                }
                            />
                        </FormControl>
                        <Button
                            colorScheme={'blue'}
                            variant={'solid'}
                            onClick={handleLogin}
                        >
                            Sign in
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    );
}
