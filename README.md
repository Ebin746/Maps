
# 🗺️ ChatMap

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://example.com/build)

A web application that utilizes AI and News APIs to generate insights related to user-provided event data.

## Features

*   **💬 Chat Interface:** Accepts user input in the form of event details.
*   **🤖 AI-Powered Responses:** Leverages OpenAI's GPT models to generate tailored responses based on event data and selected options.
*   **📰 Real-time News Integration:** Fetches relevant news articles using the NewsAPI to enhance the context of responses.
*   **📍 Location Awareness:** Considers the location of the event to provide more accurate and relevant information.
*   **📅 Date Filtering:**  Takes event dates into account when gathering information.
*   **✨ Event Category Specificity:** Considers event categories like storms, etc for accurate responses.

## Tech Stack

| Category     | Technologies                 | Documentation                                      |
|--------------|------------------------------|--------------------------------------------------|
| Frontend     | HTML, CSS, JavaScript        | N/A                                              |
| Backend      | Node.js, Express             | [Node.js][nodejs-url], [Express][express-url]      |
| API          | OpenAI, NewsAPI              | [OpenAI][openai-url], [NewsAPI][newsapi-url]          |
| Other        | Axios, Body-parser, Dotenv, Node-fetch | [Axios][axios-url], [Body-parser][body-parser-url], [Dotenv][dotenv-url], [Node-fetch][node-fetch-url]  |

[nodejs-url]: https://nodejs.org/en/docs/
[express-url]: https://expressjs.com/en/4x/api.html
[openai-url]: https://platform.openai.com/docs/api-reference
[newsapi-url]: https://newsapi.org/docs
[axios-url]: https://axios-http.com/docs/intro
[body-parser-url]: https://github.com/expressjs/body-parser
[dotenv-url]: https://github.com/motdotla/dotenv
[node-fetch-url]: https://github.com/node-fetch/node-fetch

## Quick Start

### Prerequisites

*   Node.js (v18 or higher)

### Installation

bash
git clone [repo-url]
cd achatmap
npm install
# OR
yarn install


### Environment

Create a `.env` file in the root directory with the following variables:

env
PORT=3000
apikey=YOUR_OPENAI_API_KEY
newsApi=YOUR_NEWSAPI_KEY

> [!NOTE]
> Replace `YOUR_OPENAI_API_KEY` and `YOUR_NEWSAPI_KEY` with your actual API keys.

## Development

### Commands

bash
npm start   # Start the server using nodemon
# OR
yarn start


### Testing

Currently, the project does not include specific testing frameworks or strategies. Future development should include unit, integration, and potentially end-to-end (E2E) tests.

## API Reference

| Method | Endpoint     | Body                                                                | Response                                                       |
|--------|--------------|---------------------------------------------------------------------|----------------------------------------------------------------|
| POST   | /sendArray   | `{"data": [...], "id": "1|2|3|4"}`                                   | `{"message": "Data received and processed successfully on the server", "modifiedData": "..."}` |

## Deployment

### Dockerfile

dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]


> [!NOTE]
> Remember to build the Docker image and run it using `docker build -t achatmap .` and `docker run -p 3000:3000 achatmap`.

### Platform Guides

*   **Heroku:**  Deploy the application using the Heroku CLI.  Ensure the necessary environment variables are configured in the Heroku dashboard.
*   **AWS:**  Use AWS Elastic Beanstalk or EC2 instances to deploy the application. Consider using Docker containers for easier deployment and scaling.

## Contributing

We welcome contributions to ChatMap! Please follow these guidelines:

*   **Branch Naming:** `feat/new-feature`, `bugfix/issue-123`, `chore/update-dependencies`
*   **Commit Messages:** Use imperative mood: "Fix bug" not "Fixed bug".
*   **Pull Requests:**  Provide a clear description of the changes and their purpose. Ensure all tests pass before submitting.


### PR Template Example
Title: feat: Implement new AI feature

Description:
This PR introduces a new AI feature that enhances the user experience.

Changes:
- Added new AI model integration
- Updated the UI to support the new feature
- Added unit tests for the new feature

Related Issues: #123

Checklist:
- [x] Code follows project coding conventions
- [x] Unit tests have been added/updated
- [x] Documentation has been updated


