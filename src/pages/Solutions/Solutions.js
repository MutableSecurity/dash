import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
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
import { getSolutions } from '../../utilities/firebase_controller';

export default function Solutions(props) {
    const [receivedSolutions, markSolutionsAsReceived] = useState(false);
    const [solutions, setSolutions] = useState([MockAgent]);
    const agentId = props.agentId;

    useEffect(() => {
        getSolutions(agentId).then(result => {
            setSolutions(result);
            markSolutionsAsReceived(true);
        });
    });

    if (!receivedSolutions) return;

    var solutionsRows;
    if (solutions.length !== 0) {
        solutionsRows = solutions.map(solution => {
            return (
                <Tr>
                    <Td>{solution.solution_id}</Td>
                    <Td textAlign={'right'}>
                        <Link to={'/solution/' + solution.id}>
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
            <Heading>All Solutions of Agent</Heading>
            <TableContainer marginBottom={10}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Type</Th>
                            <Th textAlign={'right'}>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{solutionsRows}</Tbody>
                </Table>
            </TableContainer>
            <Breadcrumb
                fontWeight="extrabold"
                spacing="8px"
                separator={<FiChevronRight color="gray.500" />}
            >
                <BreadcrumbItem>
                    <BreadcrumbLink href="/agents">
                        <Tag
                            size="md"
                            key="md"
                            variant="solid"
                            colorScheme="blue"
                        >
                            All Agents
                        </Tag>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">
                        <Tag
                            size="md"
                            key="md"
                            variant="solid"
                            colorScheme="blue"
                        >
                            Agent #{agentId}
                        </Tag>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </VStack>
    );
}
