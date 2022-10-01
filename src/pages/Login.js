import {
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Image,
    Input,
    SlideFade,
    Stack,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth, signInWithEmailAndPassword } from '../controllers/auth';

import logo from '../assets/logo.svg';

const heroTexts = [
    'Deploy MutableSecurity agents.',
    'Install security solutions with our OSS.',
    'Visualize configuration of deployed solutions with Dash.',
    'Visualize functional metrics about deployed solution with Dash.',
    'Get malfunctioning alerts directly on your email inbox.',
];

export default function SplitScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentHeroText, setHeroText] = useState(heroTexts[0]);
    const [animationState, setAnimationState] = useState(0);
    const [step, setStep] = useState(1);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        moveTransitionToNextState(0);
    }, []);

    const moveTransitionToNextState = state => {
        const nextState = (state + 1) % heroTexts.length;
        const nextStep = nextState + 1;

        setAnimationState(state);
        setTimeout(() => {
            setAnimationState(-1);
            setTimeout(() => {
                setStep(nextStep);
                setHeroText(heroTexts[nextState]);
                moveTransitionToNextState(nextState);
            }, 5000);
        }, 5000);
    };

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                toast({
                    title: 'Welcome back!',
                    description:
                        'We will redirect you to the dashboard in a moment.',
                    status: 'success',
                    duration: 2000,
                    isClosable: false,
                    position: 'bottom-right',
                });

                setTimeout(() => {
                    navigate('/overview');
                }, 3000);
            })
            .catch(error => {
                console.log(error);

                toast({
                    title: 'There is an issue..',
                    description:
                        'Sorry, the email and password you entered do not match. Please try again.',
                    status: 'error',
                    duration: 4000,
                    isClosable: false,
                    position: 'bottom-right',
                });
            });
    };

    return (
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex flex={1} h="100vh" className="animated-gradient">
                <Center w="100%" textAlign={'center'} p={8}>
                    <SlideFade in={animationState !== -1}>
                        <VStack>
                            <Heading as="h2" size="lg" color={'white'}>
                                Step {step}/{heroTexts.length}:
                            </Heading>
                            <Heading
                                color={'white'}
                                w="100%"
                                as="h1"
                                size="4xl"
                            >
                                {currentHeroText}
                            </Heading>
                        </VStack>
                    </SlideFade>
                </Center>
            </Flex>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={10} w={'full'} maxW={'md'}>
                    <Stack
                        spacing={4}
                        w={'full'}
                        maxW={'md'}
                        align="center"
                        justify="center"
                    >
                        <Image src={logo} width={200} />
                        <Heading size="lg" as="h1" textAlign="center">
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
