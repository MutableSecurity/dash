export class AccountDetails {
    constructor(email, full_name, organization, profile) {
        this.email = email;
        this.full_name = full_name;
        this.organization = organization;
        this.profile = profile;
    }
}

export class AgentsConfiguration {
    constructor(reporting_interval) {
        this.reporting_interval = reporting_interval;
    }
}

export class ReportingConfiguration {
    constructor(config_change_group, failed_tests_trigger) {
        this.config_change_group = config_change_group;
        this.failed_tests_trigger = failed_tests_trigger;
    }
}

export class Settings {
    constructor(accountDetails, agentsConfiguration, reportingConfiguration) {
        this.account = accountDetails;
        this.agents_configuration = agentsConfiguration;
        this.reporting_configuration = reportingConfiguration;
    }
}
