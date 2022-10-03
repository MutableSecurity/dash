import {
    Heading,
    Link,
    Tag,
    TagLabel,
    TagRightIcon,
    Text,
    VStack,
} from '@chakra-ui/react';
import { BiLink } from 'react-icons/bi';

export function SectionDescription({ children }) {
    return (
        <Text fontSize="lg" marginTop={0}>
            {children}
        </Text>
    );
}

export function PageHeading({ children }) {
    return (
        <Heading as="h1" size="2xl" color={'gray.900'}>
            {children}
        </Heading>
    );
}

export function SectionHeading({ children }) {
    return (
        <Heading as="h2" size="xl" color={'gray.800'}>
            {children}
        </Heading>
    );
}

function Pill(props) {
    return (
        <Link href={props.pillLink} isExternal={props.pillLinkIsExternal}>
            <Tag
                size={'sm'}
                variant="subtle"
                colorScheme="blue"
                verticalAlign={'middle'}
                marginLeft={2}
            >
                <TagLabel>{props.pillTitle}</TagLabel>
                <TagRightIcon as={BiLink} />
            </Tag>
        </Link>
    );
}

export function SectionHeadingWithDescription(props) {
    var pill = props.pillTitle ? (
        <Pill
            pillTitle={props.pillTitle}
            pillLink={props.pillLink}
            pillLinkIsExternal={props.pillLinkIsExternal}
        />
    ) : (
        ''
    );

    return (
        <VStack spacing={2} align="stretch">
            <SectionHeading>
                {props.title}
                {pill}
            </SectionHeading>

            <SectionDescription>{props.description}</SectionDescription>
        </VStack>
    );
}

export function SubSectionHeading({ children }) {
    return (
        <Heading as="h3" size="lg" color={'gray.700'}>
            {children}
        </Heading>
    );
}

export function SubSectionHeadingWithDescription(props) {
    var pill = props.pillTitle ? (
        <Pill
            pillTitle={props.pillTitle}
            pillLink={props.pillLink}
            pillLinkIsExternal={props.pillLinkIsExternal}
        />
    ) : (
        ''
    );

    return (
        <VStack spacing={2} align="stretch">
            <SubSectionHeading>
                {props.title}
                {pill}
            </SubSectionHeading>
            <SectionDescription>{props.description}</SectionDescription>
        </VStack>
    );
}
