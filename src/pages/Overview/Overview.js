import {
    Flex,
    Heading,
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
} from '../../components/TimeChartsWithCursor/TimeChartsWithCursor';
import { MockMonthStatistics } from '../../utilities/data_models';

export default function Overview() {
    const [receivedStats, markStatsAsReceived] = useState(false);
    const [lastMonthStatistics, setLastMonthStatistics] =
        useState(MockMonthStatistics);

    useEffect(() => {
        setLastMonthStatistics(MockMonthStatistics);
        markStatsAsReceived(true);
    }, []);
    // useEffect(() => {
    //     getLastMonthStatistics().then(result => {
    //         setLastMonthStatistics(result);
    //         markStatsAsReceived(true);
    //     });
    // });

    const solutionsInstalledNow =
        lastMonthStatistics.solutionsCounts[
            lastMonthStatistics.solutionsCounts.length - 1
        ];
    const availabilityPercentageNow =
        lastMonthStatistics.availabilityPercentages[
            lastMonthStatistics.availabilityPercentages.length - 1
        ];

    if (!receivedStats) return;
    else
        return (
            <VStack spacing={4} p={3} align="stretch" bgColor={'white'}>
                <Heading>Overview</Heading>
                <Flex>
                    <Stat>
                        <StatLabel>Installed Solutions</StatLabel>
                        <StatNumber>{solutionsInstalledNow}</StatNumber>
                        <StatHelpText>in the last report</StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>Passed Tests Percentage</StatLabel>
                        <StatNumber>{availabilityPercentageNow}%</StatNumber>
                        <StatHelpText>in the last report</StatHelpText>
                    </Stat>
                    <Stat>
                        <StatLabel>Reports</StatLabel>
                        <StatNumber>
                            {lastMonthStatistics.reportsCount}
                        </StatNumber>
                        <StatHelpText>in the last month</StatHelpText>
                    </Stat>
                </Flex>
                <Heading as="h3" size="lg">
                    Monthly Graphs
                </Heading>
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
