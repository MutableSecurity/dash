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
import { MockAgent, MockSolution } from '../../utilities/data_models';
import { getAgent, getSolutions } from '../../utilities/firebase_controller';
import { getDescription, getFullName } from '../../utilities/solutions_details';

export default function Agent(props) {
    const [receivedSolutions, markSolutionsAsReceived] = useState(false);
    const [agent, setAgent] = useState(MockAgent);
    const [solutions, setSolutions] = useState([MockSolution]);
    const agentId = props.agentId;

    useEffect(() => {
        getSolutions(agentId).then(result => {
            setSolutions(result);
            markSolutionsAsReceived(true);
        });

        getAgent(agentId).then(result => {
            setAgent(result);

            props.setTitleMethod('Agent ' + result.alias);
        });
    });

    if (!receivedSolutions) return;

    var solutionsRows;
    if (solutions.length !== 0) {
        solutionsRows = solutions.map(solution => {
            var fullName = getFullName(solution.solution_id);
            var description = getDescription(solution.solution_id);

            return (
                <Tr>
                    <Td>{fullName}</Td>
                    <Td>{description}</Td>
                    <Td textAlign={'right'}>
                        <Link
                            to={
                                '/agents/' +
                                agentId +
                                '/solutions/' +
                                solution.id
                            }
                        >
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
    } else {
        solutionsRows = <Tr>No data</Tr>;
    }

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
