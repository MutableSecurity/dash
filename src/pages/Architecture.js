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
import { MockAgent } from '../utilities/data_models';
import { getAgents } from '../utilities/firebase_controller';

export default function Architecture(props) {
    const [receivedAgents, markAgentsAsReceived] = useState(false);
    const [agents, setAgents] = useState([MockAgent]);

    props.setTitleMethod('Architecture');

    useEffect(() => {
        getAgents().then(result => {
            setAgents(result);
            markAgentsAsReceived(true);

            props.notifyLoadedMethod(true);
        });
    });

    if (!receivedAgents) return;

    var agentsRows;
    if (agents.length !== 0) {
        agentsRows = agents.map((agent, key) => {
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
    } else {
        agentsRows = <Tr>No data</Tr>;
    }

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
