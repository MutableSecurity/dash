export class MonthStastistics {
    constructor(
        agentsCount,
        reportsCount,
        timestamps,
        solutionsCounts,
        availabilityPercentages,
        failedTestsCounts,
        passedTestsCounts
    ) {
        this.agentsCount = agentsCount;
        this.reportsCount = reportsCount;
        this.timestamps = timestamps;
        this.solutionsCounts = solutionsCounts;
        this.availabilityPercentages = availabilityPercentages;
        this.failedTestsCounts = failedTestsCounts;
        this.passedTestsCounts = passedTestsCounts;
    }
}

export const MockMonthStatistics = new MonthStastistics(
    0,
    0,
    [],
    [],
    [],
    [],
    []
);
