import { data } from '../data/data';
import { MonthStastistics } from '../models/overview';
import { incremetKeyOrCreate } from './common';

export function generateMonthStatisticsFromReports(startDate, endDate) {
    var reportsCount = 0;
    var rawFailedTestsCounts = new Map();
    var rawPassedTestsCounts = new Map();
    var failedTestsCounts = [];
    var passedTestsCounts = [];
    var availabilityPercentages = [];
    var timestamps = [];

    data.tests.forEach(test => {
        if (test.passed === true) {
            incremetKeyOrCreate(rawPassedTestsCounts, test.timestamp);
        } else {
            incremetKeyOrCreate(rawFailedTestsCounts, test.timestamp);
        }
    });

    reportsCount = data.information.length + data.tests.length;

    rawPassedTestsCounts.forEach((_, timestamp) => {
        if (!(timestamp >= startDate && timestamp <= endDate)) {
            return;
        }

        var passedTests = rawPassedTestsCounts.get(timestamp) || 0;
        var failedTests = rawFailedTestsCounts.get(timestamp) || 0;
        var availabilityPercentage =
            (100 * passedTests) / (passedTests + failedTests);

        failedTestsCounts.push(failedTests);
        passedTestsCounts.push(passedTests);
        availabilityPercentages.push(availabilityPercentage);

        timestamps.push(timestamp);
    });

    return new MonthStastistics(
        data.agents.length,
        reportsCount,
        data.solutions.length,
        timestamps,
        availabilityPercentages,
        failedTestsCounts,
        passedTestsCounts
    );
}

export function getLastMonthStatistics() {
    var currentDate = Math.floor(Date.now() / 1000);
    var monthAgo = currentDate - 31 * 24 * 60 * 1000;

    return generateMonthStatisticsFromReports(monthAgo, currentDate);
}
