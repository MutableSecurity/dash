import { data } from '../data/data';
import { TimeseriesWithValues } from '../models/generic';
import { incremetKeyOrCreate } from './common';

export function getLastTestFailed(solutionId, testsCount) {
    var tests = data.tests
        .filter(
            test =>
                test.solution_id === solutionId && !test.passed && !test.checked
        )
        .slice(-testsCount);

    return tests;
}

export function getPassedTestsPercentagesForSolution(solutionId) {
    var passedTestsCounts = new Map();
    var failedTestsCounts = new Map();
    var timestamps = new Set();
    var percentages = [];

    data.tests
        .filter(test => test.solution_id === solutionId)
        .forEach(test => {
            if (test.passed) {
                incremetKeyOrCreate(passedTestsCounts, test.timestamp);
            } else {
                incremetKeyOrCreate(failedTestsCounts, test.timestamp);
            }

            timestamps.add(test.timestamp);
        });

    timestamps = Array.from(timestamps).sort();

    timestamps.forEach(timestamp => {
        var passedTests = passedTestsCounts.get(timestamp) || 0;
        var failedTests = failedTestsCounts.get(timestamp) || 0;
        var percentage = (100 * passedTests) / (passedTests + failedTests);

        percentages.push(percentage);
    });

    return new TimeseriesWithValues(timestamps, percentages);
}

export function setTestAsChecked(test) {
    test.checked = true;
}
