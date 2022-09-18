import { plainToClass } from 'class-transformer';

import { IS_TESTING } from '../config';
import { Settings } from '../models/account';
import { Agent } from '../models/agent';
import { Information } from '../models/information';
import { Solution } from '../models/solution';
import { Test } from '../models/test';
import { get as getDummy } from './dummy';
import { get as getFirebase } from './firebase';

class Database {
    constructor() {
        var used_data = IS_TESTING ? getDummy() : getFirebase();

        this.init_account(used_data);
        this.init_agents(used_data);
        this.init_solutions(used_data);
        this.init_tests(used_data);
        this.init_information(used_data);
    }

    init_account(data) {
        var accountsId = Object.keys(data.users)[0];

        this.account = plainToClass(Settings, data.users[accountsId]);
    }

    init_agents(data) {
        this.agents = Object.keys(data.agents).map(key => {
            var agent = plainToClass(Agent, data.agents[key]);

            agent.id = key;

            return agent;
        });
    }

    init_solutions(data) {
        this.solutions = Object.keys(data.solutions).map(key => {
            var solution = plainToClass(Solution, data.solutions[key]);

            solution.id = key;

            return solution;
        });
    }

    init_tests(data) {
        this.tests = [];

        Object.keys(data.tests_reports).forEach(test_id => {
            var current_report = data.tests_reports[test_id];

            var tests = Object.keys(current_report)
                .map(test_id => {
                    if (test_id === 'solution_id' || test_id === 'timestamp')
                        return undefined;

                    return new Test(
                        test_id,
                        current_report.timestamp,
                        current_report[test_id],
                        current_report.solution_id,
                        current_report.checked.includes(test_id)
                    );
                })
                .filter(test => !!test);

            this.tests.push(...tests);
        });
    }

    init_information(data) {
        this.information = [];

        Object.keys(data.information_reports).forEach(test_id => {
            var current_report = data.information_reports[test_id];

            var info = Object.keys(current_report)
                .map(info_id => {
                    if (info_id === 'solution_id' || info_id === 'timestamp')
                        return undefined;

                    return new Information(
                        info_id,
                        current_report.solution_id,
                        current_report.timestamp,
                        current_report[info_id]
                    );
                })
                .filter(test => !!test);

            this.information.push(...info);
        });
    }
}

export var data = new Database();
