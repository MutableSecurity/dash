import {
    Code,
    IconButton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiZoomIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import {
    PageHeading,
    SectionHeadingWithDescription,
} from '../components/Headings';
import { getAllAgents } from '../controllers/agent';

export default function Architecture(props) {
    const [agents, setAgents] = useState([]);
    const [receivedData, notifyReceivedData] = useState(false);

    useEffect(() => {
        var agents = getAllAgents();
        setAgents(agents);
        notifyReceivedData(true);
        props.notifyLoadedMethod(true);
    }, [props]);

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
                        <Tooltip
                            hasArrow
                            label="View agent"
                            placement="left"
                            bg="black"
                            color="white"
                        >
                            <IconButton
                                colorScheme="blue"
                                aria-label="Inspect agent"
                                icon={<FiZoomIn />}
                            />
                        </Tooltip>
                    </Link>
                </Td>
            </Tr>
        );
    });

    return (
        <VStack spacing={8} p={3} align="stretch" bgColor={'white'}>
            <PageHeading>Architecture</PageHeading>
            <SectionHeadingWithDescription
                title="Your Agents"
                description="Installed agents on every managed device. They automate the host's security solutions and provide data to the MutableSecurity Dash."
            />
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
