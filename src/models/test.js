export class Test {
    constructor(
        test_id,
        parent_report,
        timestamp,
        passed,
        solution_id,
        checked,
        parentDatabase
    ) {
        this.test_id = test_id;
        this.parent_report = parent_report;
        this.timestamp = timestamp;
        this.passed = passed;
        this.solution_id = solution_id;
        this.checked = checked;
        this.parentDatabase = parentDatabase;
    }

    markAsChecked() {
        this.checked = true;

        this.parentDatabase.setTestAsChecked(this.parent_report, this.test_id);
    }
}
