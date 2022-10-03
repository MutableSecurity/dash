import solutions_data from '../data/offline/solutions.json';

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

export function getDocumentationURL(solutionId) {
    return 'https://mutablesecurity.io/docs/users/modules/' + solutionId;
}

export function getInformationDocumentationURL(solutionId) {
    return (
        'https://mutablesecurity.io/docs/users/modules/' +
        solutionId +
        '#information'
    );
}

export function getTestsDocumentationURL(solutionId) {
    return (
        'https://mutablesecurity.io/docs/users/modules/' + solutionId + '#tests'
    );
}

function getInformationWithProperty(solutionId, property) {
    const information = solutions_data.solutions[solutionId].information;

    var metrics = [];
    Object.keys(information).forEach(current_key => {
        if (information[current_key].properties.includes(property)) {
            metrics.push(current_key);
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

export function getPlottableMetricsForSolution(solutionId) {
    const information = solutions_data.solutions[solutionId].information;

    var plottable = [];
    getAvailableMetricsForSolution(solutionId).forEach(current_key => {
        var type = information[current_key].type;

        if (type === 'INTEGER' || type === 'BOOLEAN' || type === 'STRING') {
            plottable.push(current_key);
        }
    });

    return plottable;
}

export function getInformationDescription(solutionId, informationId) {
    return solutions_data.solutions[solutionId].information[informationId]
        .description;
}

export function getTestDescription(solutionId, testId) {
    return solutions_data.solutions[solutionId].tests[testId].description;
}
