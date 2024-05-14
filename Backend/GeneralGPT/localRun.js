x = require('./build/index.js');
x.handler({
    body: JSON.stringify({
        messages: [
            {
                "content": "",
                "role": "assistant",
                "language": "en-US"
            }
        ]
    })
}).then(e => console.log(e));
