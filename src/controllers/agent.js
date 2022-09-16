import { data } from '../data/data';

export function getAllAgents() {
    return data.agents;
}

export function countAllAgents() {
    return data.agents.length;
}

export function getAgent(agentId) {
    return data.agents.find(agent => agent.id === agentId);
}
