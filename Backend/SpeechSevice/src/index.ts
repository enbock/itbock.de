import {
    PollyClient,
    SynthesizeSpeechCommand,
    SynthesizeSpeechCommandInput,
    SynthesizeSpeechCommandOutput
} from "@aws-sdk/client-polly";

const client: PollyClient = new PollyClient();

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

    return await response.AudioStream.transformToString("base64");
};