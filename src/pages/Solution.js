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

import { TimeLineChartWithCursor } from '../components/TimeChartsWithCursor';
import {
    getAvailableMetricsForSolution,
    getCategories,
    getDescription,
    getFullName,
    getInformationDescription,
    getMaturity,
    getTestDescription,
} from '../controllers/abstract_solution';
import { getAgent } from '../controllers/agent';
import {
    getLastConfiguration,
    getMetricsValues,
} from '../controllers/information';
import { getSolution } from '../controllers/solution';
import {
    getLastTestFailed,
    getPassedTestsPercentagesForSolution,
} from '../controllers/test';
import { convertUTCSecondsToFormattedDate } from '../utilities/date';

export default function Solution(props) {
    const [title, setTitle] = useState('');
    const [solution, setSolution] = useState(null);
    const [agent, setAgent] = useState(null); // eslint-disable-line
    const [lastConfig, setLastConfig] = useState();
    const [currentValuesForMetric, setCurrentValuesForMetric] = useState([]);
    const [passedTests, setPassedTests] = useState();
    const [lastFailedTests, setLastTestsFailed] = useState();
    const [currentMetricTests, setCurrentMetricTests] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [receivedData, notifyReceivedData] = useState(false);
    const solutionId = props.solutionId;

    useEffect(() => {
        var solution = getSolution(solutionId);
        setSolution(solution);
        var abstractId = solution.solution_id;
        var agent = getAgent(props.agentId);
        setAgent(agent);
        setTitle(getFullName(abstractId) + ' Managed By Agent ' + agent.alias);
        setCurrentValuesForMetric(getAvailableMetricsForSolution(abstractId));
        setPassedTests(getPassedTestsPercentagesForSolution(solution.id));
        setLastTestsFailed(getLastTestFailed(solution.id, 10));
        setLastConfig(getLastConfiguration(solution));

        var metrics = getMetricsValues(
            solutionId,
            currentValuesForMetric[tabIndex]
        );
        setCurrentMetricTests(
            [...Array(currentValuesForMetric.length)].fill(metrics)
        );

        notifyReceivedData(true);
        props.notifyLoadedMethod(true);
    }, [solutionId, props, currentValuesForMetric, tabIndex]);

    if (!receivedData) return;

    var configurationRows = Object.keys(lastConfig).map(key => {
        return (
            <Tr key={key}>
                <Td>
                    <Code>{key}</Code>
                </Td>
                <Td>{getInformationDescription(solution.solution_id, key)}</Td>
                <Td>{lastConfig[key]}</Td>
            </Tr>
        );
    });

    var availableMetricsTabs = currentValuesForMetric.map((identifier, key) => {
        return <Tab key={key}>{identifier}</Tab>;
    });

    var availableMetricsPanel = currentMetricTests.map(identifier => {
        return (
            <TabPanel>
                <TimeLineChartWithCursor
                    timestamps={identifier.timestamps}
                    values={identifier.values}
                    yDomain={[0, 10]}
                    yLabel="Value"
                />
            </TabPanel>
        );
    });

    var passedTestsChart = (
        <TimeLineChartWithCursor
            timestamps={passedTests.timestamps}
            values={passedTests.values}
            yDomain={[0, 100]}
            valuePreffix="%"
            yLabel="Passed Tests Percentage"
        />
    );

    var failedTestsRows = lastFailedTests.map((test, key) => {
        return (
            <Tr key={key}>
                <Td>{convertUTCSecondsToFormattedDate(test.timestamp)}</Td>
                <Td>{<Code>{test.id}</Code>}</Td>
                <Td>
                    {getTestDescription(solution.solution_id, test.test_id)}
                </Td>
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
    var genericSolutionDetails = (
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
            <Heading as="h1" size="xl">
                {title}
            </Heading>

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

            <Tabs
                variant="solid-rounded"
                colorScheme="blue"
                size="sm"
                isLazy
                onChange={index => setTabIndex(index)}
            >
                <TabList>{availableMetricsTabs}</TabList>
                <TabPanels>{availableMetricsPanel}</TabPanels>
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
            {genericSolutionDetails}
        </VStack>
    );
}
