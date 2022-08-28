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
import { auth } from './auth';
import { Agent, AgentStatus, MonthStastistics, Settings } from './data_models';
import mock_data from './offline_firebase.json';

const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCuxxjfdyRRU0IkgmuN07bizMzq90KZeV4',
    authDomain: 'mutablesecurity.firebaseapp.com',
    databaseURL:
        'https://mutablesecurity-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'mutablesecurity',
    storageBucket: 'mutablesecurity.appspot.com',
    messagingSenderId: '256666998300',
    appId: '1:256666998300:web:91e485c2fd01da8ad871d9',
    measurementId: 'G-Q4EYX6MQST',
};
export const app = initializeApp(FIREBASE_CONFIG);
const database = ref(getDatabase(app));
const TESTING = true;
const PROMISE_DELAY = 100;
const ONLINE_TIME_WINDOW = 1000 * 60 * 60 * 24;

function createTestPromise(data) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(data);
        }, PROMISE_DELAY);
    });
}

export function getUserSettings() {
    const userID = auth.currentUser.uid;

    if (TESTING) {
        var data = plainToClass(
            Settings,
            mock_data.VLjFcXZ1aiddKubb1rBSHABCpvm1.settings
        );

        return createTestPromise(data);
    }

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

export function getLastMonthStatistics() {
    const userID = auth.currentUser.uid;
    const monthInSeconds = 31 * 24 * 60 * 60;
    const now = Math.floor(Date.now() / 1000);
    const startDate = now - monthInSeconds;

    if (TESTING) {
        var data = generateMonthStatisticsFromReports(
            mock_data.VLjFcXZ1aiddKubb1rBSHABCpvm1.agents,
            startDate,
            now
        );

        return createTestPromise(data);
    }

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

    agentsData.forEach(agent => {
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

export function getAgents() {
    if (TESTING) {
        var data = mock_data.VLjFcXZ1aiddKubb1rBSHABCpvm1.agents.map(agent => {
            var returnedAgent = plainToClass(Agent, agent);
            var firstSolution = agent.solutions[0];
            var lastReport =
                firstSolution.reports[firstSolution.reports.length - 1];

            returnedAgent.solutionsCounts = agent.solutions.length;
            returnedAgent.lastTimestamp = 1000 * lastReport.timestamp;
            if (
                1000 * lastReport.timestamp + ONLINE_TIME_WINDOW >=
                Date.now()
            ) {
                returnedAgent.status = AgentStatus.ONLINE;
            } else {
                returnedAgent.status = AgentStatus.UNKNOWN;
            }

            return returnedAgent;
        });

        return createTestPromise(data);
    }
}
