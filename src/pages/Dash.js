import {
    Avatar,
    Box,
    CloseButton,
    Drawer,
    DrawerContent,
    Flex,
    HStack,
    Icon,
    IconButton,
    Image,
    Link,
    Spacer,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiLogOut, FiMenu, FiTarget, FiUser } from 'react-icons/fi';
import { GrNodes } from 'react-icons/gr';
import { useNavigate, useParams } from 'react-router-dom';

import { auth, signOut } from '../utilities/auth';
import { MockSettings } from '../utilities/data_models';
import { getUserSettings } from '../utilities/firebase_controller';
import Account from './Account';
import Agent from './Agent';
import Architecture from './Architecture';
import Overview from './Overview';
import Solution from './Solution';

import logo from '../assets/logo.svg';

export default function Dash(props, { children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userData, setUserData] = useState(MockSettings);
    const [title, setTitle] = useState('');
    const { agentID, solutionID } = useParams();

    getUserSettings().then(result => {
        setUserData(result);
    });

    var innerPage;
    if (props.overview) {
        innerPage = <Overview userData={userData} setTitleMethod={setTitle} />;
    } else if (props.architecture) {
        innerPage = (
            <Architecture userData={userData} setTitleMethod={setTitle} />
        );
    } else if (props.account) {
        innerPage = <Account userData={userData} setTitleMethod={setTitle} />;
    } else if (props.agent) {
        innerPage = <Agent agentId={agentID} setTitleMethod={setTitle} />;
    } else if (props.solution) {
        innerPage = (
            <Solution
                agentId={agentID}
                solutionId={solutionID}
                setTitleMethod={setTitle}
            />
        );
    }

    return (
        <Box minH="100vh" bg="white">
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <MobileNav title={title} userData={userData} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="10" background="white">
                {innerPage}
                {children}
            </Box>
        </Box>
    );
}

const SidebarContent = ({ onClose, ...rest }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const LinkItems = [
        {
            name: 'Overview',
            icon: FiTarget,
            action: () => {
                navigate('/overview');
            },
        },
        {
            name: 'Architecture',
            icon: GrNodes,
            action: () => {
                navigate('/architecture');
            },
        },
        {
            name: 'Account',
            icon: FiUser,
            action: () => {
                navigate('/account');
            },
        },
        {
            name: 'Log Out',
            icon: FiLogOut,
            action: () => {
                logout();
            },
        },
    ];

    const logout = () => {
        signOut(auth)
            .then(() => {
                toast({
                    title: 'Until next time!',
                    description: 'We will log you out in a moment.',
                    status: 'success',
                    duration: 2000,
                    isClosable: false,
                });

                setTimeout(() => {
                    navigate('/');
                }, 3000);
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex
                h="150"
                alignItems="center"
                mx="8"
                justifyContent="space-between"
            >
                <Image src={logo} height="100px" margin="auto" />
                <CloseButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onClose}
                />
            </Flex>
            {LinkItems.map(link => (
                <NavItem key={link.name} icon={link.icon} onClick={link.action}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children, ...rest }) => {
    return (
        <Link
            href="#"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
        >
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'blue.500',
                    color: 'white',
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const MobileNav = ({ title, userData, onOpen, ...rest }) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}
        >
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex' }}
                fontSize="2xl"
                className="logo-text"
                fontWeight={900}
                color="black"
            >
                {title}
            </Text>

            <Spacer />

            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <HStack>
                        <Avatar size={'sm'} src={userData.account.profile} />
                        <VStack
                            display={{ base: 'none', md: 'flex' }}
                            alignItems="flex-start"
                            spacing="1px"
                            ml="2"
                        >
                            <Text fontSize="sm">
                                {userData.account.full_name}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                                {userData.account.organization}
                            </Text>
                        </VStack>
                    </HStack>
                </Flex>
            </HStack>
        </Flex>
    );
};
