import { data } from '../data/data';

export function getAllSolutions() {
    return data.solutions;
}

export function getSolutionsOfAgent(agentId) {
    return data.solutions.filter(solution => solution.parent_agent === agentId);
}

export function getSolution(solutionId) {
    return data.solutions.find(solution => solution.id === solutionId);
}
