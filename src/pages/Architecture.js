import {
    Code,
    Heading,
    IconButton,
    SkeletonText,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiZoomIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { getAgents } from '../utilities/firebase_controller';

export default function Architecture(props) {
    const [agents, setAgents] = useState([]);
    const [receivedData, notifyReceivedData] = useState(false);

    props.setTitleMethod('Architecture');

    useEffect(() => {
        getAgents().then(data => {
            setAgents(data);
            notifyReceivedData(true);
            props.notifyLoadedMethod(true);
        });
    });

    if (!receivedData) return;

    const agentsRows = agents.map((agent, key) => {
        return (
            <Tr key={key}>
                <Td>
                    <Code>{agent.alias}</Code>
                </Td>
                <Td>{agent.description}</Td>
                <Td textAlign={'right'}>
                    <Link to={'/agents/' + agent.id}>
                        <IconButton
                            colorScheme="blue"
                            aria-label="Inspect agent"
                            icon={<FiZoomIn />}
                        />
                    </Link>
                </Td>
            </Tr>
        );
    });

    return (
        <VStack spacing={4} p={3} align="stretch" bgColor={'white'}>
            <Heading>Your Agents</Heading>
            <SkeletonText mt="4" noOfLines={2} spacing="4" />
            <TableContainer marginBottom={10}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Alias</Th>
                            <Th>Description</Th>
                            <Th textAlign="right">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{agentsRows}</Tbody>
                </Table>
            </TableContainer>
        </VStack>
    );
}
