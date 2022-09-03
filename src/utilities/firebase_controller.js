import {
    child,
    get,
    getDatabase,
    orderByChild,
    query,
    ref,
    startAt,
} from 'firebase/database';

import { plainToClass } from 'class-transformer';
import { initializeApp } from 'firebase/app';
import mock_data from '../data/offlineFirebase.json';
import { auth } from './auth';
import {
    FIREBASE_CONFIG,
    IS_TESTING,
    PROMISE_DELAY_WHEN_TESTING,
} from './config';
import {
    Agent,
    FailedTestDetails,
    MetricValues,
    MockMonthStatistics,
    MonthStastistics,
    Settings,
    Solution,
} from './data_models';

export const app = initializeApp(FIREBASE_CONFIG);
const database = ref(getDatabase(app));
const MONTH_IN_SECONDS = 31 * 24 * 60 * 60;
const MEASUREMENTS_IN_TEST = 10;
const TEST_TIMESTAMPS = [...Array(MEASUREMENTS_IN_TEST).keys()].map(
    x => Math.floor(Date.now() / 1000) - (MEASUREMENTS_IN_TEST - x) * 3600
);
const METRICS_VALUES = [...Array(MEASUREMENTS_IN_TEST)].map(() =>
    Math.floor(Math.random() * 9)
);
const PASSED_TESTS_VALUES = [...Array(MEASUREMENTS_IN_TEST)].map(() =>
    Math.floor(Math.random() * 100)
);

function createTestPromise(data) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(data);
        }, PROMISE_DELAY_WHEN_TESTING);
    });
}

function getUserSettingsProd() {
    const userID = auth.currentUser.uid;

    return get(child(database, 'UserData/' + userID + '/settings'))
        .then(snapshot => {
            if (snapshot.exists()) {
                var data = snapshot.val();
                var settings = plainToClass(Settings, data);

                return settings;
            } else {
                return null;
            }
        })
        .catch(error => {
            console.log(error);

            return null;
        });
}

function getUserSettingsTest() {
    var data = plainToClass(
        Settings,
        mock_data.users.VLjFcXZ1aiddKubb1rBSHABCpvm1
    );

    return createTestPromise(data);
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

    return createTestPromise(MockMonthStatistics);
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

function incremetKeyOrCreate(map, key) {
    var oldValue = map.get(key);

    if (oldValue === undefined) {
        map.set(key, 1);
    } else {
        map.set(key, oldValue + 1);
    }
}

function getAgentsProd() {
    return createTestPromise({});
}

function getAgentsTest() {
    var data = Object.keys(mock_data.agents).map(key => {
        var returnedAgent = plainToClass(Agent, mock_data.agents[key]);
        returnedAgent.id = key;

        return returnedAgent;
    });

    return createTestPromise(data);
}

function getAgentProd(agentId) {
    return createTestPromise({});
}

function getAgentTest(agentId) {
    var returnedAgent = plainToClass(Agent, mock_data.agents[agentId]);

    return createTestPromise(returnedAgent);
}

function getSolutionProd(solutionId) {
    return createTestPromise({});
}

function getSolutionTest(solutionId) {
    var data = plainToClass(Solution, mock_data.solutions[solutionId]);

    return createTestPromise(data);
}

function getSolutionsProd(agentId) {
    return createTestPromise({});
}

function getSolutionsTest(agentId) {
    var data = Object.keys(mock_data.solutions)
        .map(key => {
            var solution = mock_data.solutions[key];

            if (solution['parent_agent'] !== agentId) {
                return null;
            }

            var returnedSolution = plainToClass(Solution, solution);
            returnedSolution.id = key;

            return returnedSolution;
        })
        .filter(solution => !!solution);

    return createTestPromise(data);
}

function getLastConfigurationProd(solutionId) {
    return createTestPromise({});
}

function getLastConfigurationTest(solutionId) {
    var allInformation = mock_data.information_reports['-NAs41CC-k7QFJ2EDk-T'];
    var data = {
        current_user: allInformation['current_user'],
        machine_id: allInformation['machine_id'],
    };

    return createTestPromise(data);
}

function getMetricsValueProd(solutionId, informationId) {
    return createTestPromise({});
}

function getMetricsValueTest(solutionId, informationId) {
    var data = new MetricValues(TEST_TIMESTAMPS, METRICS_VALUES);

    return createTestPromise(data);
}

function getPassedTestsForSolutionProd(solutionId) {
    return createTestPromise({});
}

function getPassedTestsForSolutionTest(solutionId) {
    var data = new MetricValues(TEST_TIMESTAMPS, PASSED_TESTS_VALUES);

    return createTestPromise(data);
}

function getLastTestFailedProd(solutionId, testsCount) {
    return createTestPromise({});
}

function getLastTestFailedTest(solutionId, testsCount) {
    var data = TEST_TIMESTAMPS.map(timestamp => {
        return new FailedTestDetails(timestamp, 'ubuntu');
    });

    return createTestPromise(data);
}

export const getUserSettings = IS_TESTING
    ? getUserSettingsTest
    : getUserSettingsProd;
export const getLastMonthStatistics = IS_TESTING
    ? getLastMonthStatisticsTest
    : getLastMonthStatisticsProd;
export const getAgent = IS_TESTING ? getAgentTest : getAgentProd;
export const getAgents = IS_TESTING ? getAgentsTest : getAgentsProd;
export const getSolutionsOfAgent = IS_TESTING
    ? getSolutionsTest
    : getSolutionsProd;
export const getSolution = IS_TESTING ? getSolutionTest : getSolutionProd;
export const getLastConfiguration = IS_TESTING
    ? getLastConfigurationTest
    : getLastConfigurationProd;
export const getMetricsValue = IS_TESTING
    ? getMetricsValueTest
    : getMetricsValueProd;
export const getPassedTestsForSolution = IS_TESTING
    ? getPassedTestsForSolutionTest
    : getPassedTestsForSolutionProd;
export const getLastTestFailed = IS_TESTING
    ? getLastTestFailedTest
    : getLastTestFailedProd;
