import { Heading, Text, VStack } from '@chakra-ui/react';

export function SectionDescription({ children }) {
    return (
        <Text fontSize="lg" marginTop={0}>
            {children}
        </Text>
    );
}

export function PageHeading({ children }) {
    return (
        <Heading as="h1" size="2xl">
            <Text
                display={'inline'}
                color="var(--chakra-colors-blue-500)"
                fontWeight={500}
            >
                #
            </Text>{' '}
            {children}
        </Heading>
    );
}

export function SectionHeading({ children }) {
    return (
        <Heading as="h2" size="xl">
            <Text
                display={'inline'}
                color="var(--chakra-colors-blue-500)"
                fontWeight={500}
            >
                ##
            </Text>{' '}
            {children}
        </Heading>
    );
}

export function SectionHeadingWithDescription(props) {
    return (
        <VStack spacing={2} align="stretch">
            <SectionHeading>{props.title}</SectionHeading>
            <SectionDescription>{props.description}</SectionDescription>
        </VStack>
    );
}

export function SubSectionHeading({ children }) {
    return (
        <Heading as="h3" size="lg">
            <Text
                display={'inline'}
                color="var(--chakra-colors-blue-500)"
                fontWeight={500}
            >
                ###
            </Text>{' '}
            {children}
        </Heading>
    );
}

export function SubSectionHeadingWithDescription(props) {
    return (
        <VStack spacing={2} align="stretch">
            <SubSectionHeading>{props.title}</SubSectionHeading>
            <SectionDescription>{props.description}</SectionDescription>
        </VStack>
    );
}
