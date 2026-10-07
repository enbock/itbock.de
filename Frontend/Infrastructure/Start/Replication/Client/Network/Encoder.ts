export default class Encoder {
    constructor(
        private loadStateEndpoint: string
    ) {
    }

    public encodeLoadStateEndpoint(version: number): string {
        const separator: string = this.loadStateEndpoint.includes('?') ? '&' : '?';
        return `${this.loadStateEndpoint}${separator}version=${encodeURIComponent(String(version))}`;
    }
}
