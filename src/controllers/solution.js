import { plainToClass } from 'class-transformer';

import { IS_TESTING } from '../config';
import mock_data from '../data/offlineFirebase.json';
import { FailedTestDetails, MetricValues, Solution } from '../models/solution';
import { createMockedFirebasePromise } from './common';

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

function getSolutionProd(solutionId) {
    return createMockedFirebasePromise({});
}

function getSolutionTest(solutionId) {
    var solution = plainToClass(Solution, mock_data.solutions[solutionId]);
    var configPromise = getLastConfiguration(solutionId).then(config => {
        solution.last_configuration_set = config;
    });
    var failedTestsPromise = getLastTestFailed(solutionId).then(failedTests => {
        solution.last_tests_failed = failedTests;
    });
    var passedTests = getPassedTestsForSolution(solutionId).then(
        passedTests => {
            solution.passed_tests = passedTests;
        }
    );

    return Promise.all([configPromise, failedTestsPromise, passedTests]).then(
        () => {
            return solution;
        }
    );
}

export const getSolution = IS_TESTING ? getSolutionTest : getSolutionProd;

function getMetricsValueProd(solutionId, informationId) {
    return createMockedFirebasePromise({});
}

function getMetricsValueTest(solutionId, informationId) {
    var data = new MetricValues(TEST_TIMESTAMPS, METRICS_VALUES);

    return createMockedFirebasePromise(data);
}

export const getMetricsValue = IS_TESTING
    ? getMetricsValueTest
    : getMetricsValueProd;

function getPassedTestsForSolutionProd(solutionId) {
    return createMockedFirebasePromise({});
}

function getPassedTestsForSolutionTest(solutionId) {
    var data = new MetricValues(TEST_TIMESTAMPS, PASSED_TESTS_VALUES);

    return createMockedFirebasePromise(data);
}

export const getPassedTestsForSolution = IS_TESTING
    ? getPassedTestsForSolutionTest
    : getPassedTestsForSolutionProd;

function getLastTestFailedProd(solutionId, testsCount) {
    return createMockedFirebasePromise({});
}

function getLastTestFailedTest(solutionId, testsCount) {
    var data = TEST_TIMESTAMPS.map(timestamp => {
        return new FailedTestDetails(timestamp, 'ubuntu');
    });

    return createMockedFirebasePromise(data);
}

export const getLastTestFailed = IS_TESTING
    ? getLastTestFailedTest
    : getLastTestFailedProd;

function getLastConfigurationProd(solutionId) {
    return createMockedFirebasePromise({});
}

function getLastConfigurationTest(solutionId) {
    var allInformation = mock_data.information_reports['-NAs41CC-k7QFJ2EDk-T'];
    var data = {
        current_user: allInformation['current_user'],
        machine_id: allInformation['machine_id'],
    };

    return createMockedFirebasePromise(data);
}

export const getLastConfiguration = IS_TESTING
    ? getLastConfigurationTest
    : getLastConfigurationProd;
