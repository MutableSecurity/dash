import { Box, Flex, Heading, Image, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { FaRegAddressCard, FaRegBuilding } from 'react-icons/fa';
import { FiAtSign, FiCamera } from 'react-icons/fi';

import {
    AnnotatedRadioGroup,
    AnnotatedSlider,
    AnnotatedTextInput,
} from '../components/AnnotatedInputs';

export default function Account(props) {
    var userData = props.userData;

    useEffect(() => {
        props.notifyLoadedMethod(true);
    }, [props]);

    const changeFailedTestsTrigger = function (newValue) {
        userData.reporting_configuration.failed_tests_trigger = newValue;
    };

    return (
        <VStack spacing={8} p={3} align="stretch" bgColor={'white'}>
            <Heading as="h1" size="2xl">
                Account
            </Heading>

            <Heading as="h2" size="xl">
                Account Details
            </Heading>
            <VStack spacing={4} align="stretch">
                <AnnotatedTextInput
                    title="Full Name"
                    description="Your full name"
                    value={userData.account.full_name}
                    icon={<FaRegAddressCard color="gray.300" />}
                    inputType="text"
                />
                <AnnotatedTextInput
                    title="Email Address"
                    description="The email address you use to log in into Dash"
                    value={userData.account.email}
                    icon={<FiAtSign color="gray.300" />}
                    inputType="email"
                />
                <AnnotatedTextInput
                    title="Organization"
                    description="The organization whom infrastructure you manage"
                    value={userData.account.organization}
                    icon={<FaRegBuilding color="gray.300" />}
                    inputType="text"
                />
                <Flex>
                    <AnnotatedTextInput
                        title="Profile Picture"
                        description="Your profile picture"
                        placeholder="Click to select a new profile picture"
                        icon={<FiCamera color="gray.300" />}
                        inputType="file"
                        flex={1}
                    />
                    <Box
                        w="16"
                        marginLeft={4}
                        marginTop="auto"
                        marginBottom="auto"
                    >
                        <Image
                            src={userData.account.profile}
                            borderRadius="md"
                        />
                    </Box>
                </Flex>
            </VStack>

            <Heading as="h2" size="xl">
                Agents Configuration
            </Heading>
            <AnnotatedRadioGroup
                title="Reporting Interval"
                description="Interval between two consecutive sendings of data from an agent to MutableSecurity servers"
                radioLabels={['Every minute', 'Every hour', 'Every day']}
                radioValues={['60', '3600', '86400']}
                value={userData.agents_configuration.reporting_interval.toString()}
            />

            <Heading as="h2" size="xl">
                Email Reporting Configuration
            </Heading>
            <VStack spacing={4} align="stretch">
                <AnnotatedSlider
                    title="Number of Failed Tests Before Reporting"
                    description="Number of tests to fail before reporting the events by email"
                    min={0}
                    max={100}
                    step={5}
                    value={
                        userData.reporting_configuration.failed_tests_trigger
                    }
                    onChange={changeFailedTestsTrigger}
                />
                <AnnotatedRadioGroup
                    title="Trigger for Configuration Change Reporting"
                    description="The moment in which the configuration change should be
                reported to you by email"
                    radioLabels={['When any test fails', 'Daily', 'Weekly']}
                    radioValues={['instant', 'daily', 'weekly']}
                    value={userData.reporting_configuration.config_change_group}
                />
            </VStack>
        </VStack>
    );
}
