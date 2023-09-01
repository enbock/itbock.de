import {
    PollyClient,
    SynthesizeSpeechCommand,
    SynthesizeSpeechCommandInput,
    SynthesizeSpeechCommandOutput
} from "@aws-sdk/client-polly";
import {S3} from "@aws-sdk/client-s3"

const client: PollyClient = new PollyClient();
const s3: S3 = new S3();

function convertUint8ArrayToBinaryString(u8Array) {
    var i, len = u8Array.length, b_str = "";
    for (i = 0; i < len; i++) {
        b_str += String.fromCharCode(u8Array[i]);
    }
    return b_str;
}

exports.handler = async function (event: any, context:any): Promise<any> {
    console.log("Event-Data:", event, context);
    const input: SynthesizeSpeechCommandInput = {
        Engine: "neural",
        LanguageCode: "de-DE",
        OutputFormat: "mp3",
        SampleRate: "24000",
        Text: event.query.text || "Das ist eine generierte Beispielausgabe.",
        TextType: "text",
        VoiceId: "Vicki"
    };
    const command: SynthesizeSpeechCommand = new SynthesizeSpeechCommand(input);
    const response: SynthesizeSpeechCommandOutput = await client.send(command);

    let audio = await response.AudioStream.transformToByteArray();

    return btoa(convertUint8ArrayToBinaryString(audio));
    /* for proxy
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': 'https://www.itbock.de',
            'Content-Type': 'audio/mpeg'
        },
        body: convertUint8ArrayToBinaryString(audio)
    };
    */
};