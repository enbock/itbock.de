export default class Encoder {
    constructor(
        private loadStateEndpoint: string
    ) {
    }

    public encodeLoadStateEndpoint(): string {
        return this.loadStateEndpoint;
    }
}
