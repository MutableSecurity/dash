import {
    Code,
    Heading,
    IconButton,
    SkeletonText,
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
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiCheck } from 'react-icons/fi';

import { TimeLineChartWithCursor } from '../../components/TimeChartsWithCursor/TimeChartsWithCursor';
import { MockAgent, MockSolution } from '../../utilities/data_models';
import { convertUTCSecondsToFormattedDate } from '../../utilities/date';
import {
    getAgent,
    getLastConfiguration,
    getLastTestFailed,
    getMetricsValue,
    getPassedTestsForSolution,
    getSolution,
} from '../../utilities/firebase_controller';
import {
    getAvailableMetricsForSolution,
    getCategories,
    getDescription,
    getFullName,
    getInformationDescription,
    getMaturity,
    getTestDescription,
} from '../../utilities/solutions_details';

export default function Solution(props) {
    const [receivedSolution, markSolutionAsReceived] = useState(false);
    const [solution, setSolution] = useState(MockSolution);
    const [agent, setAgent] = useState(MockAgent);
    const [lastConfigurationSet, setLastConfigurationSet] = useState({});
    const solutionId = props.solutionId;

    useEffect(() => {
        getSolution(solutionId).then(result => {
            setSolution(result);

            getLastConfiguration(result.solution_id).then(configurationSet => {
                setLastConfigurationSet(configurationSet);

                markSolutionAsReceived(true);
            });

            getAgent(props.agentId).then(result => {
                setAgent(result);

                props.setTitleMethod(
                    getFullName(solution.solution_id) +
                        ' Managed By Agent ' +
                        result.alias
                );
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
                <Td>{getInformationDescription(solution.solution_id, key)}</Td>
                <Td>{lastConfigurationSet[key]}</Td>
            </Tr>
        );
    });

    var tabList = getAvailableMetricsForSolution(solution.solution_id).map(
        identifier => {
            return <Tab>{identifier}</Tab>;
        }
    );
    var tabPanelsList = getAvailableMetricsForSolution(
        solution.solution_id
    ).map(identifier => {
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
    });

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
                <Td>{getTestDescription(solution.solution_id, test.id)}</Td>
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

    var solutionCategories = getCategories(solution.solution_id).map(
        category => (
            <Tag size="md" key="md" variant="solid" colorScheme="blue">
                {category}
            </Tag>
        )
    );
    var solutionDetails = (
        <VStack spacing={3} p={0} align="stretch" bgColor={'white'}>
            <Text>
                <Text as="b">Identifier</Text>:{' '}
                <Code>{solution.solution_id}</Code>
            </Text>
            <Text>
                <Text as="b">Full Name</Text>:{' '}
                {getFullName(solution.solution_id)}
            </Text>
            <Text>
                <Text as="b">Description</Text>:{' '}
                {getDescription(solution.solution_id)}
            </Text>
            <Text>
                <Text as="b">Categories</Text>: {solutionCategories}
            </Text>
            <Text>
                <Text as="b">Maturity</Text>:{' '}
                {getMaturity(solution.solution_id)}
            </Text>
        </VStack>
    );

    return (
        <VStack spacing={4} p={3} align="stretch" bgColor={'white'}>
            <Heading as="h1" size="lg">
                Information
            </Heading>
            <SkeletonText mt="4" noOfLines={1} spacing="4" />

            <Heading as="h2" size="md">
                Current Configuration
            </Heading>
            <SkeletonText mt="4" noOfLines={2} spacing="4" />

            <TableContainer marginBottom={10}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Identifier</Th>
                            <Th>Description</Th>
                            <Th>Value</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{configurationRows}</Tbody>
                </Table>
            </TableContainer>

            <Heading as="h2" size="md">
                Metrics Graphs
            </Heading>
            <SkeletonText mt="4" noOfLines={2} spacing="4" />

            <Tabs variant="solid-rounded" colorScheme="blue" size="sm" isLazy>
                <TabList>{tabList}</TabList>
                <TabPanels>{tabPanelsList}</TabPanels>
            </Tabs>

            <Heading as="h1" size="lg">
                Tests
            </Heading>
            <SkeletonText mt="4" noOfLines={1} spacing="4" />

            <Heading as="h2" size="md">
                Passed Tests Percentages
            </Heading>
            <SkeletonText mt="4" noOfLines={2} spacing="4" />
            {passedTestsChart}

            <Heading as="h2" size="md">
                Last Failed Tests
            </Heading>
            <SkeletonText mt="4" noOfLines={2} spacing="4" />
            <TableContainer marginBottom={10}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Fail Time</Th>
                            <Th>Test Identifier</Th>
                            <Th>Test Description</Th>
                            <Th textAlign="center">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{failedTestsRows}</Tbody>
                </Table>
            </TableContainer>

            <Heading as="h1" size="lg">
                General Information
            </Heading>
            {solutionDetails}
        </VStack>
    );
}
