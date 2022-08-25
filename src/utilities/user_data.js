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
import { auth } from './auth';
import app from './firebase';

const database = ref(getDatabase(app));

class AccountDetails {
    constructor(email, full_name, organization, profile) {
        this.email = email;
        this.full_name = full_name;
        this.organization = organization;
        this.profile = profile;
    }
}

class AgentsConfiguration {
    constructor(reporting_interval) {
        this.reporting_interval = reporting_interval;
    }
}

class ReportingConfiguration {
    constructor(config_change_group, failed_tests_trigger) {
        this.config_change_group = config_change_group;
        this.failed_tests_trigger = failed_tests_trigger;
    }
}

class Settings {
    constructor(accountDetails, agentsConfiguration, reportingConfiguration) {
        this.account = accountDetails;
        this.agents_configuration = agentsConfiguration;
        this.reporting_configuration = reportingConfiguration;
    }
}

class MonthStastistics {
    constructor(
        reportsCount,
        solutionsCounts,
        availabilityPercentages,
        failedTestsCounts,
        passedTestsCounts
    ) {
        this.reportsCount = reportsCount;
        this.solutionsCounts = solutionsCounts;
        this.availabilityPercentages = availabilityPercentages;
        this.failedTestsCounts = failedTestsCounts;
        this.passedTestsCounts = passedTestsCounts;
    }
}

const MockAccountDetails = new AccountDetails('', '', '', '');
const MockAgentsConfiguration = new AgentsConfiguration(60);
const MockReportingConfiguration = new ReportingConfiguration(60, 'daily');
export const MockSettings = new Settings(
    MockAccountDetails,
    MockAgentsConfiguration,
    MockReportingConfiguration
);
export const MockMonthStatistics = new MonthStastistics(0, [], [], [], []);

export function getUserSettings() {
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
            return null;
        });
}

export function getLastMonthStatistics() {
    const userID = auth.currentUser.uid;
    const monthInSeconds = 31 * 24 * 60 * 60;
    const startDate = Math.floor(Date.now() / 1000) - monthInSeconds;

    var reportsRef = child(database, 'UserData/' + userID + '/reports');
    var orderQuery = query(reportsRef, orderByChild('timestamp'));
    var startsQuey = query(orderQuery, startAt(startDate, 'timestamp'));

    return get(startsQuey)
        .then(snapshot => {
            if (snapshot.exists()) {
                var reports = snapshot.val();
                console.log(reports);

                var reportsCount = 0;
                var solutionsCounts = [];
                var availabilityPercentages = [];
                var failedTestsCounts = [];
                var passedTestsCounts = [];

                reports.forEach(report => {
                    solutionsCounts.push(report.solutions.length);

                    var failedTests = 0;
                    var passedTests = 0;
                    report.solutions.forEach(solution => {
                        // console.log(solution.tests_results);
                        if (solution.tests_results) {
                            Object.values(solution.tests_results).forEach(
                                value => {
                                    if (value === true) {
                                        passedTests += 1;
                                    } else {
                                        failedTests += 1;
                                    }
                                }
                            );
                        }
                    });
                    var availabilityPercentage =
                        passedTests / (passedTests + failedTests);

                    reportsCount += 1;

                    availabilityPercentages.push(availabilityPercentage);
                    failedTestsCounts.push(failedTests);
                    passedTestsCounts.push(passedTests);
                });

                return new MonthStastistics(
                    reportsCount,
                    solutionsCounts,
                    availabilityPercentages,
                    failedTestsCounts,
                    passedTestsCounts
                );
            } else {
                return null;
            }
        })
        .catch(error => {
            console.log(error);
            return null;
        });
}
