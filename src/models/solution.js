export class Solution {
    constructor(
        id,
        solution_id,
        parent_agent,
        last_configuration_set,
        last_tests_failed,
        passed_tests
    ) {
        this.id = id;
        this.solution_id = solution_id;
        this.parent_agent = parent_agent;
        this.last_configuration_set = last_configuration_set;
        this.last_tests_failed = last_tests_failed;
        this.passed_tests = passed_tests;
    }
}

export const MockSolution = new Solution('random_firebase_id', 'dummy', '1', {
    one: 1,
    two: 2,
});

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
