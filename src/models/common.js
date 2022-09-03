const MEASUREMENTS_IN_TEST = 10;

export const DUMMY_TIMESTAMPS = [...Array(MEASUREMENTS_IN_TEST).keys()].map(
    x => Math.floor(Date.now() / 1000) - (MEASUREMENTS_IN_TEST - x) * 3600
);

export const DUMMY_METRICS_VALUES = [...Array(MEASUREMENTS_IN_TEST)].map(() =>
    Math.floor(Math.random() * 9)
);

export const DUMMY_PASSED_TESTS_VALUES = [...Array(MEASUREMENTS_IN_TEST)].map(
    () => Math.floor(Math.random() * 100)
);
