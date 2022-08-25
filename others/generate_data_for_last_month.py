#!/usr/bin/env python3

import json
import random
import time

DATA = {
    "VLjFcXZ1aiddKubb1rBSHABCpvm1": {
        "reports": [],
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
REPORT = """{{
    "solutions": [
        {{
            "information": {{
                "current_user": "root",
                "file_size": 0,
                "machine_id": "0126ebfd7c25422eb2378bea154a4db1"
            }},
            "name": "dummy",
            "tests_results": {{
                "presence": {},
                "ubuntu": {}
            }}
        }},
        {{
            "information": {{
                "interface": "eth0"
            }},
            "name": "suricata",
            "tests": {{
                "block_malware": {}
            }}
        }}
    ],
    "timestamp": {}
}}"""
SECONDS_IN_HOUR = 60 * 60
SECONDS_IN_MONTH = 31 * 24 * SECONDS_IN_HOUR
CHANGE_PROBABILITY = 100


def main() -> None:
    reports = []
    current_timestamp = int(time.time())
    last_bools = [True, True, True]
    changed_next_index = 0
    for timestamp in range(
        current_timestamp - SECONDS_IN_MONTH, current_timestamp, SECONDS_IN_HOUR
    ):
        if random.randint(0, 1 * CHANGE_PROBABILITY) == 0:
            last_bools[changed_next_index] = not last_bools[changed_next_index]
            changed_next_index = (changed_next_index + 1) % 3

        last_bools_str = [
            "true" if current else "false" for current in last_bools
        ]
        report = REPORT.format(*last_bools_str, timestamp)
        report = json.loads(report)
        reports.append(report)

    final_data = DATA
    final_data["VLjFcXZ1aiddKubb1rBSHABCpvm1"]["reports"] = reports
    print(json.dumps(final_data))


if __name__ == "__main__":
    main()
