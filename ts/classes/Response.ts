import { responseHash } from '../data';

export class Response {
    public readonly input: string;
    constructor(input: string) {
        if (!input) throw new Error('class Response must be initialized with a string.');
        this.input = input.trim();
    }

    get response() { return this.responseLookup(this.input); }

    protected responseLookup(input: string) {
        return responseHash[input] || `${input}: command not found`;
    }
}