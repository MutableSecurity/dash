export class Test {
    constructor(test_id, timestamp, passed, solution_id, checked) {
        this.test_id = test_id;
        this.timestamp = timestamp;
        this.passed = passed;
        this.solution_id = solution_id;
        this.checked = checked;
    }
}