# Webpage since 2024
In 2024 I restart my webpage https://www.itbock.de again ;)

# Idea
A AI driven webpage with code assistance for my daily developer work.

Can we do an LCARS again?

# Overview
This webpage, itbock.de, is an AI-driven platform designed to assist developers in their daily work.
It offers a variety of functionalities such as:

- **Automatic Speech Recognition (ASR)**: Converts spoken language into text.
- **Natural Language Processing (NLP)**: Powered by OpenAI's GPT-4, enabling conversational AI capabilities.
- **Audio Transformation**: Transforms audio files into text.
- **Translation Services**: Provides language translation for various texts.
- **Replicated Sessions**: The frontend keeps a browser-local session id and mirrors backend-controlled
  module, language, conversation, and document state across tabs by polling the replication API. The session replication
  (leader election and replication polling) starts only after the start button on the start page is pressed; the start
  page itself is shown immediately on load. Browser tabs elect a single leader for microphone/audio via Web Locks;
  follower tabs stay display-only and take over automatically when the leader closes.
- **Knowledge-driven Info Pages**: The frontend can render replicated document collections in a dedicated info
  view. The backend resolves the shown documents from a Markdown knowledge base indexed into S3.

# Technologies Used
The following technologies and frameworks are used in this project:

- **Frontend**:
  - **TypeScript**: Ensures type safety and modern JavaScript features.
  - **Webpack**: Module bundler for compiling TypeScript, CSS and other assets.
  - **HTML/CSS**: Views build the DOM natively (no TSX/JSX, no Shadow DOM). CSS is bundled classically
    via webpack (`style-loader` + `css-loader`).
  - **Custom Elements**: A Web Component `<audio-input>` (without Shadow DOM) handles microphone/audio input.
  - **Service Workers**: For offline capabilities and caching.

- **Backend**:
  - **Node.js**: The runtime environment used.
  - **AWS Lambda**: Serverless computing service for running backend functions.
  - **OpenAI API**: For NLP, AI-driven features and knowledge embeddings.
  - **AWS S3**: For storing sessions, the RAG knowledge index and other assets.
  - **AWS CloudFormation**: Deploys and manages the Lambda functions and API Gateway (no Serverless Framework).

# License
This project is licensed under the MIT License.
