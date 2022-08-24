import {
    Box,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Radio,
    RadioGroup,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Stack,
    VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaRegAddressCard, FaRegBuilding } from 'react-icons/fa';
import { FiAtSign, FiCamera } from 'react-icons/fi';

function EditableInput(props) {
    return (
        <Box flex={props.flex}>
            <FormControl>
                <FormLabel>{props.title}</FormLabel>
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={props.icon}
                    />
                    <Input
                        type="{props.type}"
                        isDisabled
                        value={props.value}
                        placeholder={props.placeholder}
                    />
                </InputGroup>
                <FormHelperText>{props.description}</FormHelperText>
            </FormControl>
        </Box>
    );
}

export default function Account() {
    const [failedTests, setFailedTests] = useState(5);

    return (
        <VStack spacing={4} p={3} align="stretch" bgColor={'white'}>
            <Heading>Settings</Heading>

            <Heading as="h3" size="lg">
                Account Details
            </Heading>
            <EditableInput
                title="Full Name"
                description="Your full name"
                value="George-Andrei Iosif"
                icon={<FaRegAddressCard color="gray.300" />}
                inputType="text"
            />
            <EditableInput
                title="Email Address"
                description="The email address you use to log in into Dash"
                value="andrei@mutablesecurity.io"
                icon={<FiAtSign color="gray.300" />}
                inputType="email"
            />
            <EditableInput
                title="Organization"
                description="The organization whom infrastructure you manage"
                value="MutableSecurity"
                icon={<FaRegBuilding color="gray.300" />}
                inputType="text"
            />
            <Flex>
                <EditableInput
                    title="Profile Picture"
                    description="Your profile picture"
                    placeholder="Click to select a new profile picture"
                    icon={<FiCamera color="gray.300" />}
                    inputType="file"
                    flex={1}
                />
                <Box w="70px" margin="auto 0 auto 20px">
                    <Image
                        src="https://github.com/iosifache.png"
                        borderRadius="md"
                    />
                </Box>
            </Flex>

            <Heading as="h3" size="lg">
                Agents Configuration
            </Heading>
            <FormControl>
                <FormLabel>Reporting Interval</FormLabel>
                <RadioGroup
                    defaultValue="1"
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="base"
                    padding={2}
                >
                    <Stack direction="row">
                        <Radio value="1">Every minute</Radio>
                        <Radio value="2">Every hour</Radio>
                        <Radio value="3">Every day</Radio>
                    </Stack>
                </RadioGroup>
                <FormHelperText>
                    Interval between two consecutive sendings of data from an
                    agent to MutableSecurity servers
                </FormHelperText>
            </FormControl>

            <Heading as="h3" size="lg">
                Email Reporting Configuration
            </Heading>
            <FormControl>
                <FormLabel>Number of Failed Tests Before Reporting</FormLabel>
                <Slider
                    aria-label="slider-ex-1"
                    defaultValue={5}
                    min={0}
                    max={100}
                    step={5}
                    onChange={setFailedTests}
                    w="50%"
                    isDisabled
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={10}>
                        <Box color="blue">{failedTests}</Box>
                    </SliderThumb>
                </Slider>
                <FormHelperText>
                    Number of tests to fail before reporting the events by email
                </FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>
                    Trigger for Configuration Change Reporting
                </FormLabel>
                <RadioGroup
                    defaultValue="2"
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="base"
                    padding={2}
                >
                    <Stack direction="row">
                        <Radio value="1">When any test fails</Radio>
                        <Radio value="2">Daily</Radio>
                        <Radio value="3">Weekly</Radio>
                    </Stack>
                </RadioGroup>
                <FormHelperText>
                    The moment in which the configuration change should be
                    reported to you by email
                </FormHelperText>
            </FormControl>
        </VStack>
    );
}
