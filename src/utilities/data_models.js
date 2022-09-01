export class AccountDetails {
    constructor(email, full_name, organization, profile) {
        this.email = email;
        this.full_name = full_name;
        this.organization = organization;
        this.profile = profile;
    }
}

export const MockAccountDetails = new AccountDetails('', '', '', '');

export class AgentsConfiguration {
    constructor(reporting_interval) {
        this.reporting_interval = reporting_interval;
    }
}

export const MockAgentsConfiguration = new AgentsConfiguration(60);

export class ReportingConfiguration {
    constructor(config_change_group, failed_tests_trigger) {
        this.config_change_group = config_change_group;
        this.failed_tests_trigger = failed_tests_trigger;
    }
}

export const MockReportingConfiguration = new ReportingConfiguration(
    60,
    'daily'
);

export class Settings {
    constructor(accountDetails, agentsConfiguration, reportingConfiguration) {
        this.account = accountDetails;
        this.agents_configuration = agentsConfiguration;
        this.reporting_configuration = reportingConfiguration;
    }
}

export const MockSettings = new Settings(
    MockAccountDetails,
    MockAgentsConfiguration,
    MockReportingConfiguration
);

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

export const AgentStatus = {
    ONLINE: 'online',
    UNKNOWN: 'unknown',
};

export class Agent {
    constructor(id, alias, description) {
        this.id = id;
        this.alias = alias;
        this.description = description;
    }
}

export const MockAgent = new Agent('id', 'server', 'Server');

export class Solution {
    constructor(solution_id, parent_agent) {
        this.solution_id = solution_id;
        this.parent_agent = parent_agent;
    }
}

export const MockSolution = new Agent('dummy');

export class MetricValues {
    constructor(timestamps, values) {
        this.timestamps = timestamps;
        this.values = values;
    }
}

export class FailedTestDetails {
    constructor(timestamp, id) {
        this.timestamp = timestamp;
        this.id = id;
    }
}
