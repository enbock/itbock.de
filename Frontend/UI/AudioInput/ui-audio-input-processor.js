class RMSProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = [];
        this.bufferSize = 1024;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const inputChannel = input[0];
        if (!inputChannel) {
            return true;
        }

        for (let i = 0; i < inputChannel.length; i++) {
            this.buffer.push(inputChannel[i]);
            if (this.buffer.length >= this.bufferSize) {
                const rms = this.calculateRMS(this.buffer);
                this.port.postMessage(rms);
                this.buffer = [];
            }
        }

        return true;
    }

    calculateRMS(buffer) {
        let sumOfSquares = 0;
        for (let i = 0; i < buffer.length; i++) {
            sumOfSquares += buffer[i] * buffer[i];
        }
        return Math.sqrt(sumOfSquares / buffer.length);
    }
}

registerProcessor('rms-processor', RMSProcessor);
