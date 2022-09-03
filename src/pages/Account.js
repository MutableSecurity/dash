import { Box, Flex, Heading, Image, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaRegAddressCard, FaRegBuilding } from 'react-icons/fa';
import { FiAtSign, FiCamera } from 'react-icons/fi';

import {
    AnnotatedRadioGroup,
    AnnotatedSlider,
    AnnotatedTextInput,
} from '../components/AnnotatedInputs';

export default function Account(props) {
    var userData = props.userData;

    props.setTitleMethod('Account');

    const changeFailedTestsTrigger = function (newValue) {
        userData.reporting_configuration.failed_tests_trigger = newValue;
    };

    return (
        <VStack spacing={4} p={3} align="stretch" bgColor={'white'}>
            <Heading>Settings</Heading>

            <Heading as="h3" size="lg">
                Account Details
            </Heading>
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
                <Box w="70px" margin="auto 0 auto 20px">
                    <Image src={userData.account.profile} borderRadius="md" />
                </Box>
            </Flex>

            <Heading as="h3" size="lg">
                Agents Configuration
            </Heading>
            <AnnotatedRadioGroup
                title="Reporting Interval"
                description="Interval between two consecutive sendings of data from an agent to MutableSecurity servers"
                radioLabels={['Every minute', 'Every hour', 'Every day']}
                radioValues={['60', '3600', '86400']}
                value={userData.agents_configuration.reporting_interval.toString()}
            />

            <Heading as="h3" size="lg">
                Email Reporting Configuration
            </Heading>
            <AnnotatedSlider
                title="Number of Failed Tests Before Reporting"
                description="Number of tests to fail before reporting the events by email"
                min={0}
                max={100}
                step={5}
                value={userData.reporting_configuration.failed_tests_trigger}
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
    );
}
