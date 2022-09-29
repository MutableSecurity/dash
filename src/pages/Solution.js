import {
    Button,
    Code,
    Flex,
    IconButton,
    Image,
    Link,
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
    Tooltip,
    Tr,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiCheck, FiExternalLink } from 'react-icons/fi';

import {
    PageHeading,
    SectionHeadingWithDescription,
    SubSectionHeadingWithDescription,
} from '../components/Headings';
import { TimeLineChartWithCursor } from '../components/TimeChartsWithCursor';
import {
    getCategories,
    getDescription,
    getDocumentationURL,
    getFullName,
    getInformationDescription,
    getMaturity,
    getPlottableMetricsForSolution,
    getTestDescription,
} from '../controllers/abstract_solution';
import { getAgent } from '../controllers/agent';
import {
    getLastConfiguration,
    getPlottableMetricsValues,
} from '../controllers/information';
import { getSolution } from '../controllers/solution';
import {
    getLastTestFailed,
    getPassedTestsPercentagesForSolution,
    setTestAsChecked,
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
    const [updatePassedTestsFlag, updatePassedTests] = useState(false);

    useEffect(() => {
        var solution = getSolution(props.solutionId);
        setSolution(solution);
        var abstractId = solution.solution_id;
        var agent = getAgent(props.agentId);
        setAgent(agent);
        setTitle(
            <span>
                {getFullName(abstractId)} Managed By Agent{' '}
                <Code fontSize={'inherit'}>{agent.alias}</Code>
            </span>
        );
        setCurrentValuesForMetric(getPlottableMetricsForSolution(abstractId));
        setPassedTests(getPassedTestsPercentagesForSolution(solution.id));
        setLastConfig(getLastConfiguration(solution));

        notifyReceivedData(true);
        props.notifyLoadedMethod(true);
    }, [props]);

    useEffect(() => {
        if (solution) {
            setLastTestsFailed(getLastTestFailed(solution.id, 10));
        }
    }, [solution, updatePassedTestsFlag]);

    useEffect(() => {
        var metrics = getPlottableMetricsValues(
            props.solutionId,
            currentValuesForMetric[tabIndex]
        );
        setCurrentMetricTests(
            [...Array(currentValuesForMetric.length)].fill(metrics)
        );
    }, [props, currentValuesForMetric, tabIndex]);

    const markTestAsVerified = test => {
        setTestAsChecked(test);

        updatePassedTests(updatePassedTestsFlag => !updatePassedTestsFlag);
    };

    if (!receivedData) return;

    var configurationRows = Object.keys(lastConfig).map(key => {
        return (
            <Tr key={key}>
                <Td>
                    <Code>{key}</Code>
                </Td>
                <Td>
                    <Code>{lastConfig[key]}</Code>
                </Td>
                <Td>{getInformationDescription(solution.solution_id, key)}</Td>
            </Tr>
        );
    });

    var availableMetricsTabs = currentValuesForMetric.map((identifier, key) => {
        return (
            <Tooltip
                hasArrow
                label="View metric"
                placement="bottom"
                bg="black"
                color="white"
            >
                <Tab key={key}>{identifier}</Tab>
            </Tooltip>
        );
    });

    var availableMetricsPanel = currentMetricTests.map(identifier => {
        return (
            <TabPanel>
                <TimeLineChartWithCursor
                    timestamps={identifier.timestamps}
                    values={identifier.values}
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

    var failedTestsRows = lastFailedTests
        ? lastFailedTests.map((test, key) => {
              return (
                  <Tr key={key}>
                      <Td>
                          {convertUTCSecondsToFormattedDate(test.timestamp)}
                      </Td>
                      <Td>{<Code>{test.test_id}</Code>}</Td>
                      <Td>
                          {getTestDescription(
                              solution.solution_id,
                              test.test_id
                          )}
                      </Td>
                      <Td textAlign="center">
                          <Tooltip
                              hasArrow
                              label="Mark test as checked"
                              placement="left"
                              bg="black"
                              color="white"
                          >
                              <IconButton
                                  colorScheme="green"
                                  aria-label="Mark as checked"
                                  icon={<FiCheck />}
                                  onClick={() => {
                                      markTestAsVerified(test);
                                  }}
                              />
                          </Tooltip>
                      </Td>
                  </Tr>
              );
          })
        : '';

    var solutionCategories = getCategories(solution.solution_id).map(
        category => (
            <Tag
                size="lg"
                key="lg"
                variant="solid"
                colorScheme="blue"
                marginRight={2}
            >
                {category}
            </Tag>
        )
    );
    var genericSolutionDetails = (
        <Flex>
            <VStack
                spacing={3}
                p={8}
                align="stretch"
                bgColor={'white'}
                margin="auto"
            >
                <Image
                    src={
                        'https://mutablesecurity.io/images/solutions/' +
                        solution.solution_id +
                        '.webp'
                    }
                    height={32}
                    margin="auto"
                />
                <Link
                    href={getDocumentationURL(solution.solution_id)}
                    isExternal
                >
                    <Button
                        rightIcon={<FiExternalLink />}
                        colorScheme="blue"
                        variant="outline"
                    >
                        Open Documentation
                    </Button>
                </Link>
            </VStack>
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
        </Flex>
    );

    return (
        <VStack spacing={8} p={3} align="stretch" bgColor={'white'}>
            <PageHeading>{title}</PageHeading>

            <SectionHeadingWithDescription
                title="Information"
                description="Details on the current security solution"
            />

            <SubSectionHeadingWithDescription
                title="Current Configuration"
                description="Writable data that defines how the security solution should behave"
            />

            <TableContainer marginBottom={10}>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Identifier</Th>
                            <Th>Value</Th>
                            <Th>Description</Th>
                        </Tr>
                    </Thead>
                    <Tbody>{configurationRows}</Tbody>
                </Table>
            </TableContainer>

            <SubSectionHeadingWithDescription
                title="Metrics Charts"
                description="Read-only information describing the security solution"
            />

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

            <SectionHeadingWithDescription
                title="Tests"
                description="Operations with an expected outcome, that are run on a regular basis to ensure that the solution is working appropriately."
            />

            <SubSectionHeadingWithDescription
                title="Passed Tests Percentages"
                description="The percentage of tests that were run and passed"
            />
            {passedTestsChart}

            <SubSectionHeadingWithDescription
                title="Last Failed Tests"
                description="The most recently ran tests that failed. Because this is not normal behavior, please investigate the main cause."
            />
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

            <SectionHeadingWithDescription
                title="General Information"
                description="General details about the security solution"
            />
            {genericSolutionDetails}
        </VStack>
    );
}
