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
    Tooltip,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import { FiLogOut, FiMenu, FiTarget } from 'react-icons/fi';
import { GiSettingsKnobs } from 'react-icons/gi';
import { GrNodes } from 'react-icons/gr';
import { MdAutorenew } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { AUTO_REFRESH_INTERVAL } from '../config';
import { getUserSettings } from '../controllers/account';
import { auth, signOut } from '../controllers/auth';
import { data } from '../data/data';
import Agent from './Agent';
import Architecture from './Architecture';
import { LoadingScreen } from './LoadingScreen';
import Overview from './Overview';
import Settings from './Settings';
import Solution from './Solution';

import logo from '../assets/logo.svg';

export default function Dash(props, { children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [userData, setUserData] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [loadedChild, notifyLoaded] = useState(false);
    const [seed, setSeed] = useState(null);
    const { agentID, solutionID } = useParams();

    useEffect(() => {
        var user = getUserSettings();

        if (seed === null) setSeed(Math.random());

        setUserData(user);
    }, [seed]);

    var refresh = () => {
        data.init_database();

        setSeed(Math.random());
    };

    var enableAutoRefresh = () => {
        if (autoRefresh) {
            clearInterval(autoRefresh);
            setAutoRefresh(null);
        } else {
            var interval = setInterval(() => {
                refresh();
            }, AUTO_REFRESH_INTERVAL);

            setAutoRefresh(interval);
        }
    };

    var innerPage;
    if (props.overview) {
        innerPage = (
            <Overview userData={userData} notifyLoadedMethod={notifyLoaded} />
        );
    } else if (props.architecture) {
        innerPage = (
            <Architecture
                userData={userData}
                notifyLoadedMethod={notifyLoaded}
            />
        );
    } else if (props.settings) {
        innerPage = (
            <Settings userData={userData} notifyLoadedMethod={notifyLoaded} />
        );
    } else if (props.agent) {
        innerPage = (
            <Agent agentId={agentID} notifyLoadedMethod={notifyLoaded} />
        );
    } else if (props.solution) {
        innerPage = (
            <Solution
                agentId={agentID}
                solutionId={solutionID}
                notifyLoadedMethod={notifyLoaded}
            />
        );
    }

    return (
        <Box minH="100vh" minW="100vh" bg="white">
            <LoadingScreen hide={loadedChild} />
            <Box minH="100vh" bg="white" display={loadedChild ? '' : 'none'}>
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
                <MobileNav
                    userData={userData}
                    autoRefresh={autoRefresh}
                    onOpen={onOpen}
                    onRefreshMethod={refresh}
                    onEnablingAutoRefreshMethod={enableAutoRefresh}
                />
                <Box ml={{ base: 0, md: 60 }} p="10" background="white">
                    {innerPage}
                    {children}
                </Box>
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
            name: 'Settings',
            icon: GiSettingsKnobs,
            action: () => {
                navigate('/settings');
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
                <Image src={logo} height="24" margin="auto" />
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

const MobileNav = ({
    userData,
    autoRefresh,
    onOpen,
    onRefreshMethod,
    onEnablingAutoRefreshMethod,
    ...rest
}) => {
    var profileImage = '';
    var fullName = '';
    var organization = '';
    if (userData) {
        profileImage = userData.account.profile;
        fullName = userData.account.full_name;
        organization = userData.account.organization;
    }

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
            <Spacer />

            <HStack spacing={{ base: '0', md: '6' }}>
                <Flex alignItems={'center'}>
                    <HStack>
                        <Tooltip
                            hasArrow
                            label="Reload data now"
                            placement="bottom"
                            bg="black"
                            color="white"
                        >
                            <IconButton
                                size="md"
                                icon={<MdAutorenew />}
                                variant="ghost"
                                onClick={() => onRefreshMethod()}
                            />
                        </Tooltip>
                        <Tooltip
                            hasArrow
                            label="Auto-reload data at 60 seconds"
                            placement="bottom"
                            bg="black"
                            color="white"
                        >
                            <IconButton
                                size="md"
                                icon={<FaRegClock />}
                                colorScheme={autoRefresh ? 'blue' : ''}
                                variant={autoRefresh ? 'solid' : 'ghost'}
                                onClick={() => onEnablingAutoRefreshMethod()}
                            />
                        </Tooltip>
                        <Avatar size={'sm'} src={profileImage} />
                        <VStack
                            display={{ base: 'none', md: 'flex' }}
                            alignItems="flex-start"
                            spacing="0"
                            ml="2"
                        >
                            <Text fontSize="sm">{fullName}</Text>
                            <Text fontSize="xs" color="gray.600">
                                {organization}
                            </Text>
                        </VStack>
                    </HStack>
                </Flex>
            </HStack>
        </Flex>
    );
};
