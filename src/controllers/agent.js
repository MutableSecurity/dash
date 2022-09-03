import { plainToClass } from 'class-transformer';

import { IS_TESTING } from '../config';
import mock_data from '../data/offlineFirebase.json';
import { Agent } from '../models/agent';
import { Solution } from '../models/solution';
import { createMockedFirebasePromise } from './common';

function getSolutionsOfAgentProd(agentId) {
    return createMockedFirebasePromise({});
}

function getSolutionsOfAgentTest(agentId) {
    var data = Object.keys(mock_data.solutions)
        .map(key => {
            var solution = mock_data.solutions[key];

            if (solution['parent_agent'] !== agentId) {
                return null;
            }

            var returnedSolution = plainToClass(Solution, solution);
            returnedSolution.id = key;

            return returnedSolution;
        })
        .filter(solution => !!solution);

    return createMockedFirebasePromise(data);
}

export const getSolutionsOfAgent = IS_TESTING
    ? getSolutionsOfAgentTest
    : getSolutionsOfAgentProd;

function getAgentProd(agentId) {
    return createMockedFirebasePromise({});
}

function getAgentTest(agentId) {
    var returnedAgent = plainToClass(Agent, mock_data.agents[agentId]);
    returnedAgent.id = agentId;

    return getSolutionsOfAgent(agentId).then(solutionsData => {
        returnedAgent.solutions = solutionsData;

        return returnedAgent;
    });
}

export const getAgent = IS_TESTING ? getAgentTest : getAgentProd;
