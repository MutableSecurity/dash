#!/usr/bin/env python3

import json
import random
import time

DATA = {
    "VLjFcXZ1aiddKubb1rBSHABCpvm1": {
        "agents": [
            {
                "id": 0,
                "host": "Web Server",
                "solutions": [
                    {
                        "id": "dummy",
                        "reports": []
                    }
                ]
            },
            {
                "id": 1,
                "host": "Database Server",
                "solutions": [
                    {
                        "id": "dummy",
                        "reports": []
                    }
                ]
            }
        ],
        "settings": {
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
        },
    }
}
DUMMY_REPORT = """{{
    "information": {{
        "current_user": "root",
        "file_size": 0,
        "machine_id": "0126ebfd7c25422eb2378bea154a4db1"
    }},
    "tests_results": {{
        "presence": {},
        "ubuntu": {}
    }},
    "timestamp": {}
}}"""
SECONDS_IN_HOUR = 60 * 60
SECONDS_IN_MONTH = 31 * 24 * SECONDS_IN_HOUR
CHANGE_PROBABILITY = 100


def main() -> None:
    reports = []
    current_timestamp = int(time.time())
    last_bools = [True, True, True, True]
    changed_next_index = 0
    final_data = DATA
    for timestamp in range(
        current_timestamp - SECONDS_IN_MONTH, current_timestamp, SECONDS_IN_HOUR
    ):
        if random.randint(0, 1 * CHANGE_PROBABILITY) == 0:
            last_bools[changed_next_index] = not last_bools[changed_next_index]
            changed_next_index = (changed_next_index + 1) % len(last_bools)
        last_bools_str = [
            "true" if current else "false" for current in last_bools
        ]

        dummy_reports = []
        for i in range(0, 2):
            report = DUMMY_REPORT.format(*last_bools_str[2 * i:2 * (i + 1)], timestamp)
            report = json.loads(report)

            final_data["VLjFcXZ1aiddKubb1rBSHABCpvm1"]["agents"][i]["solutions"][0]["reports"].append(report)

        reports.append(report)

    print(json.dumps(final_data))


if __name__ == "__main__":
    main()
