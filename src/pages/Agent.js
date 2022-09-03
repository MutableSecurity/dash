import {
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
import { getDescription, getFullName } from '../controllers/abstract_solution';
import { getAgent } from '../controllers/agent';

export default function Agent(props) {
    const [agent, setAgent] = useState();
    const [receivedData, notifyReceivedData] = useState(false);
    const agentId = props.agentId;

    useEffect(() => {
        getAgent(agentId).then(agentData => {
            setAgent(agentData);

            notifyReceivedData(true);
            props.setTitleMethod('Agent ' + agentData.alias);
            props.notifyLoadedMethod(true);
        });
    });

    if (!receivedData) return;

    var solutionsRows = agent.solutions.map((solution, key) => {
        var fullName = getFullName(solution.solution_id);
        var description = getDescription(solution.solution_id);
        var solutionUrl = '/agents/' + agentId + '/solutions/' + solution.id;

        return (
            <Tr key={key}>
                <Td>{fullName}</Td>
                <Td>{description}</Td>
                <Td textAlign={'right'}>
                    <Link to={solutionUrl}>
                        <IconButton
                            colorScheme="blue"
                            aria-label="Inspect solution"
                            icon={<FiZoomIn />}
                        />
                    </Link>
                </Td>
            </Tr>
        );
    });

    return (
        <VStack spacing={4} p={3} align="stretch" bgColor={'white'}>
            <Heading>Managed Solutions</Heading>
            <SkeletonText mt="4" noOfLines={2} spacing="4" />
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
