#!/usr/bin/env python3

import json
import random
import time
import typing

DATA: dict = {
    "dash": {
        "VLjFcXZ1aiddKubb1rBSHABCpvm1": {
            "settings": {
                "account": {
                    "email": "tom@mutablesecurity.io",
                    "full_name": "Thomas Anderson",
                    "organization": "MutableSecurity",
                    "profile": "https://pbs.twimg.com/profile_images/733728355435065344/HxYtsA8E_400x400.jpg",
                },
                "agents_configuration": {"reporting_interval": 3600},
                "reporting_configuration": {
                    "config_change_group": "daily",
                    "failed_tests_trigger": 5,
                },
                "timestamp": 0
            },
            "agents": {
                "-NArt1ypl5yf7FU_Ilj9": {
                    "alias": "db",
                    "description": "Database server",
                    "timestamp": 0
                },
                "-NAru5tve2bGWdOHwiqN": {
                    "alias": "web",
                    "description": "Web server",
                    "timestamp": 0
                },
            },
            "solutions": {
                "-NArtmLgFklPe9UorOeY": {
                    "parent_agent": "-NArt1ypl5yf7FU_Ilj9",
                    "solution_id": "clamav",
                    "timestamp": 0
                },
                "-NAruOwsoAASPH73w2oI": {
                    "parent_agent": "-NAru5tve2bGWdOHwiqN",
                    "solution_id": "fail2ban",
                    "timestamp": 0
                },
            },
            "tests_reports": {},
            "information_reports": {},
        }
    }
}
SOLUTIONS_IDS = list(DATA["dash"]["VLjFcXZ1aiddKubb1rBSHABCpvm1"]["solutions"].keys())
CLAMAV_INFORMATION_REPORT = """{{
    "solution_id": "{}",
    "timestamp": {},
    "daily_infected_files_detected": {},
    "total_infected_files_detected": {},
    "version": "v1.7.4",
    "quarantine_location": "/home/clamav/clamav/quarantine",
    "scan_day_of_month": "1",
    "scan_day_of_week": "SUN",
    "scan_hour": "1",
    "scan_minute": "0",
    "scan_location": "/home/clamav",
    "scan_log_location": "/home/clamav/clamav/logs",
    "scan_month": "JAN"
}}"""
FAIL2BAN_INFORMATION_REPORT = """{{
    "solution_id": "{}",
    "timestamp": {},
    "active_jails": {},
    "banned_ips_count": 3,
    "jails_count": {},
    "ignored_ips": [],
    "max_retries": 5,
    "ssh_port": 22,
    "ban_seconds": 3600,
    "version": "v1.7.4"
}}"""
CLAMAV_TEST_REPORT = """{{
    "solution_id": "{}",
    "timestamp": {},
    "active_database": {},
    "eicar_detection": {},
    "internet_access": {},
    "ubuntu": {},
    "checked": []
}}"""
FAIL2BAN_TEST_REPORT = """{{
    "solution_id": "{}",
    "timestamp": {},
    "active_service": {},
    "command": {},
    "healthcheck": {},
    "ubuntu": {},
    "checked": []
}}"""
SECONDS_IN_DAY = 60 * 60 * 24
SECONDS_IN_MONTH = 31 * 60 * 60 * 24
CHANGE_PROBABILITY = 100

BoolsList = typing.List[bool]


def main() -> None:
    current_timestamp = int(time.time())
    final_data = populate_timestamps(DATA, current_timestamp)

    user_data = DATA["dash"]["VLjFcXZ1aiddKubb1rBSHABCpvm1"]
    for timestamp in range(
        current_timestamp - SECONDS_IN_MONTH,
        current_timestamp,
        SECONDS_IN_DAY,
    ):
        append_new_reports(user_data, timestamp)
    
    DATA["dash"]["VLjFcXZ1aiddKubb1rBSHABCpvm1"] = user_data

    print(json.dumps(final_data))


def populate_timestamps(data: dict, timestamp: int) -> dict:
    for key, value in data.items():
        if key == "timestamp":
            data[key] = timestamp
        elif isinstance(value, dict):
            data[key] = populate_timestamps(data[key], timestamp)
        
    return data

def append_new_reports(current_data: dict, timestamp: int) -> None:
    for index, solution_id in enumerate(SOLUTIONS_IDS):
        key = PushID().next_id()

        format = CLAMAV_INFORMATION_REPORT if (index == 0) else FAIL2BAN_INFORMATION_REPORT 
        information_report = generate_next_information_report(
            format, solution_id, timestamp
        )
        current_data["information_reports"][key] = information_report

        format = CLAMAV_TEST_REPORT if (index == 0) else FAIL2BAN_TEST_REPORT 
        tests_report = generate_next_test_results_report(
            format, solution_id, timestamp
        )
        current_data["tests_reports"][key] = tests_report


def generate_next_test_results_report(
    format: str, solution_id: str, timestamp: int
) -> dict:
    tests_results = next(tests_generator)
    tests_results_str = stringify_boolslist_elements(tests_results)
    string = format.format(
        solution_id, timestamp, *tests_results_str
    )

    return json.loads(string)


def generate_next_information_report(format: str, solution_id: str, timestamp: int) -> dict:
    first_random = random.randint(0, 1000)
    second_random =  random.randint(0, 1000)
    string = format.format(
        solution_id, timestamp, first_random, second_random
    )

    return json.loads(string)


def generate_randomized_tests_results() -> (
    typing.Generator[BoolsList, None, None]
):
    last_bools = [True, True, True, True]
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
