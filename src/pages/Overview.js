import {
    Flex,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import {
    PageHeading,
    SectionHeadingWithDescription,
} from '../components/Headings';
import {
    TimeLineChartWithCursor,
    TimeStackedChartWithCursor,
} from '../components/TimeChartsWithCursor';
import { getLastMonthStatistics } from '../controllers/overview';

export default function Overview(props) {
    const [lastMonthStatistics, setLastMonthStatistics] = useState(null);
    const [receivedData, notifyReceivedData] = useState(false);

    useEffect(() => {
        var stats = getLastMonthStatistics();
        setLastMonthStatistics(stats);
        notifyReceivedData(true);
        props.notifyLoadedMethod(true);
    }, [props]);

    if (!receivedData) return;

    const statGridData = [
        {
            name: 'Installed Agents',
            value: lastMonthStatistics.agentsCount,
            description: 'at the moment',
        },
        {
            name: 'Installed Solutions',
            value: lastMonthStatistics.solutionsCount,
            description: 'at the moment',
        },
        {
            name: 'Passed Tests Percentage',
            value: lastMonthStatistics.availabilityPercentages[
                lastMonthStatistics.availabilityPercentages.length - 1
            ],
            valuePreffix: '%',
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
                <StatNumber>
                    {details.value}
                    {details.valuePreffix}
                </StatNumber>
                <StatHelpText>{details.description}</StatHelpText>
            </Stat>
        );
    });

    return (
        <VStack spacing={8} p={3} align="stretch" bgColor={'white'}>
            <PageHeading>Overview</PageHeading>

            <SectionHeadingWithDescription
                title="Stats at a Glance"
                description="Bird-eye view statistics about your security infrastructure"
            />
            <Flex>{statsComponents}</Flex>

            <SectionHeadingWithDescription
                title="Monthly Charts"
                description="Charts generated with the data reported in the last month"
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
