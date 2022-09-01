import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Code,
    Heading,
    IconButton,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiChevronRight, FiZoomIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { MockAgent } from '../../utilities/data_models';
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
            return (
                <Tr>
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
            <Heading>All Agents</Heading>
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
            <Breadcrumb
                fontWeight="extrabold"
                spacing="8px"
                separator={<FiChevronRight color="gray.500" />}
            >
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">
                        <Tag
                            size="md"
                            key="md"
                            variant="solid"
                            colorScheme="blue"
                        >
                            Agents
                        </Tag>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </VStack>
    );
}
