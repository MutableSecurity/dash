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

export function PageHeading({ id, children }) {
    return (
        <Heading as="h1" size="2xl" color={'gray.900'} id={id}>
            {children}
        </Heading>
    );
}

export function SectionHeading({ id, children }) {
    return (
        <Heading as="h2" size="xl" color={'gray.800'} id={id}>
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

export function SectionHeadingWithDescription({ id, ...props }) {
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
            <SectionHeading id={id}>
                {props.title}
                {pill}
            </SectionHeading>

            <SectionDescription>{props.description}</SectionDescription>
        </VStack>
    );
}

export function SubSectionHeading({ id, children }) {
    return (
        <Heading as="h3" size="lg" color={'gray.700'} id={id}>
            {children}
        </Heading>
    );
}

export function SubSectionHeadingWithDescription({ id, ...props }) {
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
            <SubSectionHeading id={id}>
                {props.title}
                {pill}
            </SubSectionHeading>
            <SectionDescription>{props.description}</SectionDescription>
        </VStack>
    );
}
