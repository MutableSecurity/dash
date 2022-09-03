import { child, get, orderByChild, query, startAt } from 'firebase/database';

import { IS_TESTING } from '../config';
import mock_data from '../data/offlineFirebase.json';
import { MockMonthStatistics, MonthStastistics } from '../models/overview';
import { auth } from './auth';
import { createMockedFirebasePromise, database } from './common';

const MONTH_IN_SECONDS = 31 * 24 * 60 * 60;

function incremetKeyOrCreate(map, key) {
    var oldValue = map.get(key);

    if (oldValue === undefined) {
        map.set(key, 1);
    } else {
        map.set(key, oldValue + 1);
    }
}

function generateMonthStatisticsFromReports(agentsData, startDate, endDate) {
    var reportsCount = 0;
    var rawSolutionsCounts = new Map();
    var rawFailedTestsCounts = new Map();
    var rawPassedTestsCounts = new Map();
    var failedTestsCounts = [];
    var passedTestsCounts = [];
    var solutionsCounts = [];
    var availabilityPercentages = [];
    var timestamps = [];

    mock_data.agents.forEach(agent => {
        agent.solutions.forEach(solution => {
            solution.reports.forEach(report => {
                incremetKeyOrCreate(rawSolutionsCounts, report.timestamp);

                if (report.tests_results) {
                    Object.values(report.tests_results).forEach(value => {
                        if (value === true) {
                            incremetKeyOrCreate(
                                rawPassedTestsCounts,
                                report.timestamp
                            );
                        } else {
                            incremetKeyOrCreate(
                                rawFailedTestsCounts,
                                report.timestamp
                            );
                        }
                    });
                }
            });

            reportsCount += solution.reports.length;
        });
    });

    for (var i = startDate; i < endDate; i++) {
        var passedTests = rawPassedTestsCounts[i];
        var failedTests = rawFailedTestsCounts[i];
        var solutionCount = rawSolutionsCounts[i];

        var availabilityPercentage =
            (100 * passedTests) / (passedTests + failedTests);

        failedTestsCounts.push(failedTests);
        passedTestsCounts.push(passedTests);
        availabilityPercentages.push(availabilityPercentage);
        solutionsCounts.push(solutionCount);
    }

    timestamps = [...Array(endDate - startDate + 1).keys()].map(
        x => x + startDate
    );

    return new MonthStastistics(
        agentsData.length,
        reportsCount,
        timestamps,
        solutionsCounts,
        availabilityPercentages,
        failedTestsCounts,
        passedTestsCounts
    );
}

function getLastMonthStatisticsProd() {
    const userID = auth.currentUser.uid;
    const now = Math.floor(Date.now() / 1000);
    const startDate = now - MONTH_IN_SECONDS;

    var reportsRef = child(database, 'UserData/' + userID + '/reports');
    var orderQuery = query(reportsRef, orderByChild('timestamp'));
    var startsQuey = query(orderQuery, startAt(startDate, 'timestamp'));

    return get(startsQuey)
        .then(snapshot => {
            if (snapshot.exists()) {
                var reports = snapshot.val();

                return generateMonthStatisticsFromReports(reports);
            } else {
                return null;
            }
        })
        .catch(error => {
            console.log(error);

            return null;
        });
}

function getLastMonthStatisticsTest() {
    // const now = Math.floor(Date.now() / 1000);
    // const startDate = now - MONTH_IN_SECONDS;

    // var data = generateMonthStatisticsFromReports(
    //     mock_data.agents,
    //     startDate,
    //     Math.floor(Date.now() / 1000)
    // );

    return createMockedFirebasePromise(MockMonthStatistics);
}

export const getLastMonthStatistics = IS_TESTING
    ? getLastMonthStatisticsTest
    : getLastMonthStatisticsProd;
