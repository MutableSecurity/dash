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
import { MockAgent, MockSolution } from '../utilities/data_models';
import { convertUTCSecondsToFormattedDate } from '../utilities/date';
import {
    getAgent,
    getLastConfiguration,
    getLastTestFailed,
    getMetricsValue,
    getPassedTestsForSolution,
    getSolution,
} from '../utilities/firebase_controller';
import {
    getAvailableMetricsForSolution,
    getCategories,
    getDescription,
    getFullName,
    getInformationDescription,
    getMaturity,
    getTestDescription,
} from '../utilities/solutions_details';

export default function Solution(props) {
    const [receivedSolution, markSolutionAsReceived] = useState(false);
    const [solution, setSolution] = useState(MockSolution);
    const [agent, setAgent] = useState(MockAgent);
    const [lastConfigurationSet, setLastConfigurationSet] = useState({});
    const [passedTestsData, setPassedTestsData] = useState({});
    const [lastTestFailed, setLastTestFailed] = useState([]);
    const solutionId = props.solutionId;
    const [tabIndex, setTabIndex] = useState(0);
    const [metrics, setMetrics] = useState([]);
    const [currentMetricTests, setCurrentMetricTests] = useState([]);

    useEffect(() => {
        getSolution(solutionId).then(result => {
            setSolution(result);

            setMetrics(getAvailableMetricsForSolution(result.solution_id));

            getLastConfiguration(result.solution_id).then(configurationSet => {
                setLastConfigurationSet(configurationSet);

                markSolutionAsReceived(true);
            });

            getAgent(props.agentId).then(result => {
                setAgent(result);

                if (solution.solution_id !== undefined) {
                    props.setTitleMethod(
                        getFullName(solution.solution_id) +
                            ' Managed By Agent ' +
                            result.alias
                    );
                }
            });

            getLastTestFailed(solutionId, 5).then(result => {
                setLastTestFailed(result);
            });

            getPassedTestsForSolution(solutionId).then(data => {
                setPassedTestsData(data);
            });

            getMetricsValue(solutionId, metrics[tabIndex]).then(data => {
                setCurrentMetricTests([...Array(metrics.length)].fill(data));
            });
        });
    }, [tabIndex]);

    if (!receivedSolution) return;

    var configurationRows = Object.keys(lastConfigurationSet).map(key => {
        return (
            <Tr key={key}>
                <Td>
                    <Code>{key}</Code>
                </Td>
                <Td>{getInformationDescription(solution.solution_id, key)}</Td>
                <Td>{lastConfigurationSet[key]}</Td>
            </Tr>
        );
    });

    var tabList = metrics.map((identifier, key) => {
        return <Tab key={key}>{identifier}</Tab>;
    });

    var tabPanelsList = currentMetricTests.map(identifier => {
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

    var passedTestsChart = '';
    if (passedTestsData) {
        passedTestsChart = (
            <TimeLineChartWithCursor
                timestamps={passedTestsData.timestamps}
                values={passedTestsData.values}
                yDomain={[0, 100]}
                valuePreffix="%"
                yLabel="Passed Tests Percentage"
            />
        );
    }

    var failedTestsRows = '';
    if (lastTestFailed) {
        failedTestsRows = lastTestFailed.map((test, key) => {
            return (
                <Tr key={key}>
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
    }

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

            <Tabs
                variant="solid-rounded"
                colorScheme="blue"
                size="sm"
                isLazy
                onChange={index => setTabIndex(index)}
            >
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
