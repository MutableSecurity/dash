import {
    Badge,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Heading,
    IconButton,
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
import { FiChevronRight, FiZoomIn } from 'react-icons/fi';
import { AgentStatus, MockAgent } from '../../utilities/data_models';
import { getAgents } from '../../utilities/firebase_controller';

export default function Agents() {
    const [receivedAgents, markAgentsAsReceived] = useState(false);
    const [agents, setAgents] = useState([MockAgent]);

    useEffect(() => {
        getAgents().then(result => {
            setAgents(result);
            markAgentsAsReceived(true);
        });
    });

    if (!receivedAgents) return;

    var agentsRows;
    if (agents.length !== 0) {
        agentsRows = agents.map(agent => {
            var badge =
                agent.status === AgentStatus.ONLINE ? (
                    <Badge colorScheme="green">Online</Badge>
                ) : (
                    <Badge colorScheme="yellow">Unknown</Badge>
                );
            var timestamp = new Date(agent.lastTimestamp).toISOString();

            return (
                <Tr>
                    <Td isNumeric>{agent.id}</Td>
                    <Td>{agent.host}</Td>
                    <Td>{agent.solutionsCounts}</Td>
                    <Td>{badge}</Td>
                    <Td>{timestamp}</Td>
                    <Td>
                        <IconButton
                            colorScheme="blue"
                            aria-label="Search database"
                            icon={<FiZoomIn />}
                        />
                    </Td>
                </Tr>
            );
        });
    } else {
        agentsRows = <Tr>No data</Tr>;
    }

    return (
        <VStack spacing={4} p={3} align="stretch" bgColor={'white'}>
            <Heading>All Agents</Heading>
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th isNumeric>ID</Th>
                            <Th>Host</Th>
                            <Th>Solutions Count</Th>
                            <Th>Status</Th>
                            <Th>Last Report</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{agentsRows}</Tbody>
                </Table>
            </TableContainer>
            <Breadcrumb
                fontWeight="medium"
                spacing="8px"
                separator={<FiChevronRight color="gray.500" />}
            >
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">All Agents</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </VStack>
    );
}
