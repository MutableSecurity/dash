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
