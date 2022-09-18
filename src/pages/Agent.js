import {
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
import { getDescription, getFullName } from '../controllers/abstract_solution';
import { getAgent } from '../controllers/agent';
import { getSolutionsOfAgent } from '../controllers/solution';

export default function Agent(props) {
    const [title, setTitle] = useState('');
    const [agent, setAgent] = useState(); // eslint-disable-line
    const [solutions, setSolutions] = useState();
    const [receivedData, notifyReceivedData] = useState(false);
    const agentId = props.agentId;

    useEffect(() => {
        var agent = getAgent(agentId);
        setAgent(agent);
        setSolutions(getSolutionsOfAgent(agentId));
        setTitle('Agent ' + agent.alias);
        notifyReceivedData(true);
        props.notifyLoadedMethod(true);
    }, [props, agentId]);

    if (!receivedData) return;

    var solutionsRows = solutions.map((solution, key) => {
        var fullName = getFullName(solution.solution_id);
        var description = getDescription(solution.solution_id);
        var solutionUrl = '/agents/' + agentId + '/solutions/' + solution.id;

        return (
            <Tr key={key}>
                <Td>{fullName}</Td>
                <Td>{description}</Td>
                <Td textAlign={'right'}>
                    <Link to={solutionUrl}>
                        <Tooltip
                            hasArrow
                            label="View solution"
                            placement="left"
                            bg="black"
                            color="white"
                        >
                            <IconButton
                                colorScheme="blue"
                                aria-label="Inspect solution"
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
            <PageHeading>{title}</PageHeading>
            <SectionHeadingWithDescription
                title="Managed Solutions"
                description={
                    'Security solution managed by agent ' +
                    agent.alias +
                    '. According to the predetermined configuration, they protect the server on which they are deployed.'
                }
            />
            <TableContainer marginBottom={10}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Description</Th>
                            <Th textAlign={'right'}>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{solutionsRows}</Tbody>
                </Table>
            </TableContainer>
        </VStack>
    );
}
