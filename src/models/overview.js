import { DUMMY_TIMESTAMPS } from './common';

export class MonthStastistics {
    constructor(
        agentsCount,
        reportsCount,
        solutionsCount,
        timestamps,
        availabilityPercentages,
        failedTestsCounts,
        passedTestsCounts
    ) {
        this.agentsCount = agentsCount;
        this.reportsCount = reportsCount;
        this.solutionsCount = solutionsCount;
        this.timestamps = timestamps;
        this.availabilityPercentages = availabilityPercentages;
        this.failedTestsCounts = failedTestsCounts;
        this.passedTestsCounts = passedTestsCounts;
    }
}

export const MockMonthStatistics = new MonthStastistics(
    2,
    100,
    2,
    DUMMY_TIMESTAMPS,
    [70, 30, 50, 10, 90, 70, 30, 50, 10, 90],
    [3, 7, 5, 9, 0, 3, 7, 5, 9, 0],
    [7, 3, 5, 1, 9, 7, 3, 5, 1, 9]
);
