// noinspection JSUnresolvedReference
class RMSProcessor extends AudioWorkletProcessor {
    // noinspection JSUnusedLocalSymbols
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const inputChannel = input[0];

        if (!inputChannel) {
            return true;
        }

        let total = 0;
        for (let i = 0; i < inputChannel.length; i++) {
            total += inputChannel[i] * inputChannel[i];
        }

        const rms = Math.sqrt(total / inputChannel.length);
        this.port.postMessage(rms);

        return true;
    }
}

// noinspection JSUnresolvedReference
registerProcessor('rms-processor', RMSProcessor);
