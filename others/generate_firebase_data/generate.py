#!/usr/bin/env python3

import json
import random
import time
import typing

DATA: dict = {
    "users": {
        "VLjFcXZ1aiddKubb1rBSHABCpvm1": {
            "account": {
                "email": "andrei@mutablesecurity.io",
                "full_name": "George-Andrei Iosif",
                "organization": "MutableSecurity",
                "profile": "https://github.com/iosifache.png",
            },
            "agents_configuration": {"reporting_interval": 3600},
            "reporting_configuration": {
                "config_change_group": "daily",
                "failed_tests_trigger": 5,
            },
        }
    },
    "agents": {
        "-NArt1ypl5yf7FU_Ilj9": {
            "alias": "db",
            "parent_user": "VLjFcXZ1aiddKubb1rBSHABCpvm1",
            "description": "Database server",
        },
        "-NAru5tve2bGWdOHwiqN": {
            "alias": "web",
            "parent_user": "VLjFcXZ1aiddKubb1rBSHABCpvm1",
            "description": "Web server",
        },
    },
    "solutions": {
        "-NArtmLgFklPe9UorOeY": {
            "parent_agent": "NArt1ypl5yf7FU_Ilj9",
            "solution_id": "dummy",
        },
        "-NAruOwsoAASPH73w2oI": {
            "parent_agent": "NAru5tve2bGWdOHwiqN",
            "solution_id": "dummy",
        },
    },
    "tests_reports": {},
    "information_reports": {},
}
SOLUTIONS_IDS = list(DATA["solutions"].keys())
DUMMY_INFORMATION_REPORT = """{{
    "solution_id": "{}",
    "timestamp": {},
    "current_user": "root",
    "file_size": {},
    "machine_id": "0126ebfd7c25422eb2378bea154a4db1"
}}"""
DUMMY_TEST_REPORT = """{{
    "solution_id": "{}",
    "timestamp": {},
    "presence": {},
    "ubuntu": {}
}}"""
SECONDS_IN_DAY = 60 * 60 * 24
SECONDS_IN_MONTH = 31 * 60 * 60 * 24
CHANGE_PROBABILITY = 100

BoolsList = typing.List[bool]


def main() -> None:
    current_timestamp = int(time.time())
    final_data = DATA

    for timestamp in range(
        current_timestamp - SECONDS_IN_MONTH,
        current_timestamp,
        SECONDS_IN_DAY,
    ):
        append_new_reports(final_data, timestamp)

    print(json.dumps(final_data))


def append_new_reports(current_data: dict, timestamp: int) -> None:
    for solution_id in SOLUTIONS_IDS:
        information_report = generate_next_information_report(
            solution_id, timestamp
        )
        tests_report = generate_next_test_results_report(
            solution_id, timestamp
        )

        key = PushID().next_id()
        current_data["information_reports"][key] = information_report
        current_data["tests_reports"][key] = tests_report


def generate_next_test_results_report(
    solution_id: str, timestamp: int
) -> dict:
    tests_results = next(tests_generator)
    tests_results_str = stringify_boolslist_elements(tests_results)
    string = DUMMY_TEST_REPORT.format(
        solution_id, timestamp, *tests_results_str
    )

    return json.loads(string)


def generate_next_information_report(solution_id: str, timestamp: int) -> dict:
    random_file_size = random.randint(0, 1000)
    string = DUMMY_INFORMATION_REPORT.format(
        solution_id, timestamp, random_file_size
    )

    return json.loads(string)


def generate_randomized_tests_results() -> (
    typing.Generator[BoolsList, None, None]
):
    last_bools = [True, True]
    changed_next_index = 0

    while True:
        if (
            CHANGE_PROBABILITY == 100
            or random.randint(0, 1 * CHANGE_PROBABILITY) == 0
        ):
            last_bools[changed_next_index] = not last_bools[changed_next_index]

            changed_next_index += 1
            changed_next_index %= len(last_bools)

        yield last_bools


def stringify_boolslist_elements(array: BoolsList) -> typing.List[str]:
    return ["true" if current else "false" for current in array]


tests_generator = generate_randomized_tests_results()


class PushID(object):
    PUSH_CHARS = (
        "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz"
    )

    def __init__(self) -> None:
        self.last_push_time = 0
        self.last_rand_chars = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    def next_id(self) -> str:
        now = int(time.time() * 1000)
        duplicate_time = now == self.last_push_time
        self.last_push_time = now
        timestamp_chars = ["", "", "", "", "", "", "", ""]

        for i in range(7, -1, -1):
            timestamp_chars[i] = self.PUSH_CHARS[now % 64]
            now = int(now / 64)

        if now != 0:
            raise ValueError("We should have converted the entire timestamp.")

        uid = "".join(timestamp_chars)

        if not duplicate_time:
            for i in range(12):
                self.last_rand_chars[i] = int(random.random() * 64)
        else:
            for i in range(11, -1, -1):
                if self.last_rand_chars[i] == 63:
                    self.last_rand_chars[i] = 0
                else:
                    break
            self.last_rand_chars[i] += 1

        for i in range(12):
            uid += self.PUSH_CHARS[self.last_rand_chars[i]]

        if len(uid) != 20:
            raise ValueError("Length should be 20.")
        return uid


if __name__ == "__main__":
    main()
