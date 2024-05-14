x = require('./build/index.js');
x.handler({
    body: JSON.stringify({
        messages: [
            {
                "content": "Das Terminal ist nun bereit. Wie kann ich Ihnen helfen?",
                "role": "assistant",
                "language": "de_DE"
            }, {
                "content": "Erzähle etwas auf Spanisch, aber bleibe bei Deutsch als Eingabesprache",
                "role": "user",
                "language": "de_DE"
            }
        ]
    })
}).then(e => console.log(e));
