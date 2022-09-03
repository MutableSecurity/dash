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
} from '../components/TimeChartsWithCursor';
import { MockMonthStatistics } from '../utilities/data_models';
import { getAgents } from '../utilities/firebase_controller';

export default function Overview(props) {
    const [receivedStats, markStatsAsReceived] = useState(false);
    const [lastMonthStatistics, setLastMonthStatistics] =
        useState(MockMonthStatistics);
    const [agentsCount, setAgentsCount] = useState(0);

    useEffect(() => {
        setLastMonthStatistics(MockMonthStatistics);

        getAgents().then(agents => {
            setAgentsCount(agents.length);
        });

        markStatsAsReceived(true);
    }, []);
    // useEffect(() => {
    //     getLastMonthStatistics().then(result => {
    //         setLastMonthStatistics(result);
    //         markStatsAsReceived(true);
    //     });
    // });

    props.setTitleMethod('Overview');

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
                        <StatLabel>Agents</StatLabel>
                        <StatNumber>{agentsCount}</StatNumber>
                        <StatHelpText>at the moment</StatHelpText>
                    </Stat>
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
