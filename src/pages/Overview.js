import {
    Flex,
    Heading,
    SkeletonText,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import {
    TimeLineChartWithCursor,
    TimeStackedChartWithCursor,
} from '../components/TimeChartsWithCursor';
import { getLastMonthStatistics } from '../utilities/firebase_controller';

export default function Overview(props) {
    const [lastMonthStatistics, setLastMonthStatistics] = useState(null);
    const [receivedData, notifyReceivedData] = useState(false);

    useEffect(() => {
        getLastMonthStatistics().then(data => {
            setLastMonthStatistics(data);
            notifyReceivedData(true);
            props.setTitleMethod('Overview');
            props.notifyLoadedMethod(true);
        });
    });

    if (!receivedData) return;

    const statGridData = [
        {
            name: 'Installed Agents',
            value: lastMonthStatistics.agentsCount,
            description: 'at the moment',
        },
        {
            name: 'Installed Solutions',
            value: lastMonthStatistics.solutionsCounts[
                lastMonthStatistics.solutionsCounts.length - 1
            ],
            description: 'at the moment',
        },
        {
            name: 'Passed Tests Percentage',
            value: lastMonthStatistics.availabilityPercentages[
                lastMonthStatistics.availabilityPercentages.length - 1
            ],
            description: 'at the moment',
        },
        {
            name: 'Received Events',
            value: lastMonthStatistics.reportsCount,
            description: 'in the last months',
        },
    ];
    const statsComponents = statGridData.map((details, key) => {
        return (
            <Stat key={key}>
                <StatLabel>{details.name}</StatLabel>
                <StatNumber>{details.value}</StatNumber>
                <StatHelpText>{details.description}</StatHelpText>
            </Stat>
        );
    });

    return (
        <VStack spacing={4} p={3} align="stretch" bgColor={'white'}>
            <Heading>Stats at a Glance</Heading>
            <SkeletonText mt="4" noOfLines={1} spacing="4" />
            <Flex>{statsComponents}</Flex>

            <Heading size="lg">Monthly Graphs</Heading>
            <SkeletonText mt="4" noOfLines={2} spacing="4" />

            <TimeLineChartWithCursor
                title="Installed Solutions"
                timestamps={lastMonthStatistics.timestamps}
                values={lastMonthStatistics.solutionsCounts}
                yDomain={[0, 10]}
                yLabel="Installed Solutions"
            />

            <TimeLineChartWithCursor
                title="Passed Tests Percentage"
                timestamps={lastMonthStatistics.timestamps}
                values={lastMonthStatistics.availabilityPercentages}
                yDomain={[0, 100]}
                valuePreffix="%"
                yLabel="Passed Tests Percentage"
            />

            <TimeStackedChartWithCursor
                title="Passed-Failed Tests Distribution"
                upperValues={lastMonthStatistics.failedTestsCounts}
                upperValuesLabel="Failed Tests"
                bottomValues={lastMonthStatistics.passedTestsCounts}
                bottomValuesLabel="Passed Tests"
                timestamps={lastMonthStatistics.timestamps}
            />
        </VStack>
    );
}
