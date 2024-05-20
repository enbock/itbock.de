import AudioSyntheseClient from '../../../Core/AudioSyntheseClient';

export default class OpenAi implements AudioSyntheseClient {
    static FALLBACK: string = '/+MYxAAGe2oYEABNogG//mMbyAMY5AgUZ5Oz0wcBhBBDCaZ4DHn2An/s+Uv/////v//pEuVNkgLsHZncdDJxAeuoS0YSoQSM/+MYxCEIe14kEABHZRMf/+vf5fv/X/////+H4nviBt2MdZHQsDmcuRqp8lEHIPoWJ4LCUT2q/rnp8wneLK61FX7Uq///98qL/+MYxDoJy2okCABRSsgCKAsDMBBLpqKR3H755SGnOtXzf3ucy34cr+4Ny8v////nlM/knqzJlKigsTypghJMHAIFHV2CCB///+MYxE0JG2IcAABNTV+U6/T5Rd+T/////t/n2s8ZWt+hsbuZkHWrKKnVeSqpJYU48+9Fz/PRHf7fKy3L63n///+yl7ySEMJq/+MYxGMJg2IcAABHSRETG0ozv51xhhN1EoMhH/z95/fX/Pz3////z75bX/arzT47CTGHA0BLVEDuAowcEBicESr/Q3M+pS9S/+MYxHgJw14gCABNSNvq2mrTf/3//1v9DPzGqVpi0l4UGA5W84KSY4klWIrdTEFNRTMuOThMQU1FMy45OC4yVVVVVVVVVVVV/+MYxIwI82YcAABNTFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxKMJS2YgCABHSFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxLgJq1H4AACNTVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVEFHNTAwIE1pbGxpc2Vjb25kcyBvZiBTaWxlbmNlAAAAQW5hciBTb2Z0d2FyZSBMTEMAAAAAAAAAAAAAAAAAQmxhbmsgQXVkaW8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8=';

    constructor(
        private apiUrl: string,
        private openApiKey: string
    ) {
    }

    public async speech(inputText: string): Promise<string> {
        const headers: Record<string, string> = {
            'Authorization': 'Bearer ' + this.openApiKey,
            'Content-Type': 'application/json'
        };

        const data: Record<string, any> = {
            model: 'tts-1',
            input: inputText,
            voice: 'nova',
            speed: 1
        };

        try {
            const response: Response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (response.ok == false) {
                console.error(new Error(`Error: ${response.statusText}`));
                return OpenAi.FALLBACK;
            }
            return await this.convertAudio(response);
        } catch (error) {
            console.error('Error generating speech:', error);
            return OpenAi.FALLBACK;
        }
    }

    private async convertAudio(response: Response): Promise<string> {
        const audioBuffer: ArrayBuffer = await response.arrayBuffer();

        const buffer: Buffer = Buffer.from(audioBuffer);
        return buffer.toString('base64');
    }
}
