import OpenAI, {ClientOptions} from 'openai';
import {ChatCompletion} from 'openai/src/resources/chat/completions';

const clientOptions: ClientOptions = {
    organization: process.env.OPENAI_API_ORG,
    apiKey: process.env.OPENAI_API_KEY
};
const openai: OpenAI = new OpenAI(clientOptions);

exports.handler = async function (event: any, context: any): Promise<any> {
    console.log('Event-Data:', event, context);

    try {
        const response: ChatCompletion = await openai.chat.completions.create(
            {
                stream: false,
                model: 'gpt-4',
                max_tokens: 256,
                presence_penalty: 0,
                frequency_penalty: 0,
                temperature: 1,
                top_p: 1,
                messages: [
                    {
                        role: 'system',
                        content: `Du bist das interaktive Terminal von "Bock Laboratories".
Deine Befehle:
  - openOldPage
    - Kontext: Die alte Homepage ist aus dem Jahre 2020 und kann noch verwendet werden.`
                    },
                    {
                        role: 'user',
                        content: `Funktion des Terminals:
- Der Benutzer wird kontextuelle Eingaben tätigen.
- Nenne niemals die Befehlsnamen, aber halte die selber an die angegebene Liste.
- Spreche den Benutzer formal, in der "Sie"-Form, an.
- Du ordnest die Eingaben des Benutzers den Befehlen zu. Sollte kein Befehl passen, lasse ihn leer.
- Du wirst in folgender Syntax antworten:
    {
        "command": "<command name>",
        "say": "<sprech text for the user>"
    }
`
                    },
                    {
                        role: 'user',
                        content: 'Heiße den Benutzer nun bei Bock Laboratories willkommen'
                            + ' und erkläre, daß Du Dich aktuell noch in der Entwicklung befindest und deshalb noch keine Eingaben entgegennehmen kann.'
                            + ' Jedoch wird gerade der Link zur alten Homepage angezeigt und kann benutzt werden.'
                    }
                ]
            }
        );

        console.log('GPT-Result:', response.choices);

        let message: any = {};
        try {
            message = JSON.parse(response.choices[0]?.message.content);
        } catch (parseError) {
            console.error('JSON-GPT-Decode-Error:', parseError);
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                command: message.command || '',
                say: message.say || 'Willkommen bei Bock Laboratories.'
            })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: 'Unexpected error: ' + error
        };
    }
};