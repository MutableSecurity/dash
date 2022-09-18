import { Heading, Text } from '@chakra-ui/react';

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
