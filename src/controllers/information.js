import { data } from '../data/data';
import { TimeseriesWithValues } from '../models/generic';
import { getAvailableConfigurationForSolution } from './abstract_solution';

export function getLastConfiguration(solution) {
    var configurationKeys = getAvailableConfigurationForSolution(
        solution.solution_id
    );

    var lastConfiguration = {};
    data.information.forEach(info => {
        if (
            info.solution_id === solution.id &&
            configurationKeys.includes(info.information_id)
        ) {
            lastConfiguration[info.information_id] = info.value;
        }
    });

    return lastConfiguration;
}

export function getMetricsValues(solutionId, informationId) {
    var timestamps = [];
    var values = [];

    data.information.forEach(info => {
        if (
            info.solution_id === solutionId &&
            info.information_id === informationId
        ) {
            values.push(info.value);
            timestamps.push(info.timestamp);
        } else {
            return null;
        }
    });

    return new TimeseriesWithValues(timestamps, values);
}
