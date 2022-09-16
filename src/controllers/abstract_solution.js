import solutions_data from '../data/solutions.json';

export function getFullName(solutionId) {
    return solutions_data.solutions[solutionId].full_name;
}

export function getDescription(solutionId) {
    return solutions_data.solutions[solutionId].description;
}

export function getMaturity(solutionId) {
    return solutions_data.solutions[solutionId].maturity;
}

export function getCategories(solutionId) {
    return solutions_data.solutions[solutionId].categories;
}

function getInformationWithProperty(solutionId, property) {
    const information = solutions_data.solutions[solutionId].information;

    var metrics = [];
    Object.keys(information).forEach(current_key => {
        if (information[current_key].properties.includes(property)) {
            metrics.push(current_key);
        } else {
        }
    });

    return metrics;
}

export function getAvailableMetricsForSolution(solutionId) {
    return getInformationWithProperty(solutionId, 'METRIC');
}

export function getAvailableConfigurationForSolution(solutionId) {
    return getInformationWithProperty(solutionId, 'CONFIGURATION');
}

export function getInformationDescription(solutionId, informationId) {
    return solutions_data.solutions[solutionId].information[informationId]
        .description;
}

export function getTestDescription(solutionId, testId) {
    return solutions_data.solutions[solutionId].tests[testId].description;
}
