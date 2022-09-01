import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Code,
    Heading,
    IconButton,
    Tab,
    Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiCheck, FiChevronRight } from 'react-icons/fi';

import { TimeLineChartWithCursor } from '../../components/TimeChartsWithCursor/TimeChartsWithCursor';
import { MockSolution } from '../../utilities/data_models';
import { convertUTCSecondsToFormattedDate } from '../../utilities/date';
import {
    getLastConfiguration,
    getLastTestFailed,
    getMetricsValue,
    getPassedTestsForSolution,
    getSolution,
} from '../../utilities/firebase_controller';
import { getAvailableMetricsForSolution } from '../../utilities/solutions_details';

export default function Solution(props) {
    const [receivedSolution, markSolutionAsReceived] = useState(false);
    const [solution, setSolution] = useState(MockSolution);
    const [lastConfigurationSet, setLastConfigurationSet] = useState({});
    const solutionId = props.solutionId;

    useEffect(() => {
        getSolution(solutionId).then(result => {
            setSolution(result);

            getLastConfiguration(result.solution_id).then(configurationSet => {
                setLastConfigurationSet(configurationSet);

                markSolutionAsReceived(true);
            });
        });
    });

    if (!receivedSolution) return;

    var configurationRows = Object.keys(lastConfigurationSet).map(key => {
        return (
            <Tr>
                <Td>
                    <Code>{key}</Code>
                </Td>
                <Td>{lastConfigurationSet[key]}</Td>
            </Tr>
        );
    });

    var tabList = getAvailableMetricsForSolution(solutionId).map(identifier => {
        return <Tab>{identifier}</Tab>;
    });
    var tabPanelsList = getAvailableMetricsForSolution(solutionId).map(
        identifier => {
            var details = getMetricsValue(solutionId, identifier);

            return (
                <TabPanel>
                    <TimeLineChartWithCursor
                        timestamps={details.timestamps}
                        values={details.values}
                        yDomain={[0, 10]}
                        yLabel="Value"
                    />
                </TabPanel>
            );
        }
    );

    var passedTestsData = getPassedTestsForSolution(solutionId);
    var passedTestsChart = (
        <TimeLineChartWithCursor
            timestamps={passedTestsData.timestamps}
            values={passedTestsData.values}
            yDomain={[0, 100]}
            valuePreffix="%"
            yLabel="Passed Tests Percentage"
        />
    );

    var failedTestsRows = getLastTestFailed(solutionId, 10).map(test => {
        return (
            <Tr>
                <Td>{convertUTCSecondsToFormattedDate(test.timestamp)}</Td>
                <Td>{<Code>{test.id}</Code>}</Td>
                <Td textAlign="center">
                    <IconButton
                        colorScheme="green"
                        aria-label="Mark failed test as checked"
                        icon={<FiCheck />}
                    />
                </Td>
            </Tr>
        );
    });

    return (
        <VStack spacing={4} p={3} align="stretch" bgColor={'white'}>
            <Heading as="h1" size="lg">
                Solution <Code>dummy</Code>
            </Heading>

            <Heading as="h2" size="md">
                Information
            </Heading>

            <Heading as="h3" size="sm">
                Current Configuration
            </Heading>

            <TableContainer marginBottom={10}>
                <Table variant="simple" size="sm">
                    <Thead>
                        <Tr>
                            <Th>Identifier</Th>
                            <Th>Value</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{configurationRows}</Tbody>
                </Table>
            </TableContainer>

            <Heading as="h3" size="sm">
                Metrics Graphs
            </Heading>

            <Tabs variant="solid-rounded" colorScheme="blue" size="sm" isLazy>
                <TabList>{tabList}</TabList>
                <TabPanels>{tabPanelsList}</TabPanels>
            </Tabs>

            <Heading as="h2" size="md">
                Tests
            </Heading>

            <Heading as="h3" size="sm">
                Passed Tests Percentages
            </Heading>
            {passedTestsChart}

            <Heading as="h3" size="sm">
                Last Failed Tests
            </Heading>
            <TableContainer marginBottom={10}>
                <Table variant="simple" size="sm">
                    <Thead>
                        <Tr>
                            <Th>Timestamp</Th>
                            <Th>Test Identifier</Th>
                            <Th textAlign="center">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{failedTestsRows}</Tbody>
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
                            Agents
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
                            Agent {solution.parent_agent}
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
                            Solution {solution.solution_id}
                        </Tag>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </VStack>
    );
}
