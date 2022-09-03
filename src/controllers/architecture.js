import { plainToClass } from 'class-transformer';

import { IS_TESTING } from '../config';
import mock_data from '../data/offlineFirebase.json';
import { Agent } from '../models/agent';
import { createMockedFirebasePromise } from './common';

function getAllAgentsProd() {
    return createMockedFirebasePromise({});
}

function getAllAgentsTest() {
    var data = Object.keys(mock_data.agents).map(key => {
        var returnedAgent = plainToClass(Agent, mock_data.agents[key]);
        returnedAgent.id = key;

        return returnedAgent;
    });

    return createMockedFirebasePromise(data);
}

export const getAllAgents = IS_TESTING ? getAllAgentsTest : getAllAgentsProd;
