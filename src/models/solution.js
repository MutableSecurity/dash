export class Solution {
    constructor(
        solution_id,
        parent_agent,
        last_configuration_set,
        last_tests_failed,
        passed_tests
    ) {
        this.solution_id = solution_id;
        this.parent_agent = parent_agent;
        this.last_configuration_set = last_configuration_set;
        this.last_tests_failed = last_tests_failed;
        this.passed_tests = passed_tests;
    }
}

export const MockSolution = new Solution('dummy', '1');

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
