x = require('./build/index.js');
x.handler({
    body: JSON.stringify({
        messages: [
            {
                content: "Herzlich Willkommen bei Bock Laboratories! Derzeit befinde ich mich noch in der Entwicklung und kann daher Ihre Eingaben noch nicht bearbeiten. Allerdings ist die Verlinkung zur alten Homepage aus dem Jahr 2020 aktiv und kann von Ihnen genutzt werden.",
                role: "assistant"
            },
            {
                content: "Ja, dann lass uns zu der alten Homepage gehen.",
                role: "user"
            }
        ]
    })
}).then(e => console.log(e));