export class Agent {
    constructor(id, alias, description, solutions) {
        this.id = id;
        this.alias = alias;
        this.description = description;
        this.solutions = solutions;
    }
}

export const MockAgent = new Agent('id', 'server', 'Server', []);
