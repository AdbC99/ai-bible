# ai-bible-mcp-server

This project contains open source tooling from ai-Bible. Currenty it contains an mcp-server which is intended to provided a repeatable and reliable source of information for bible investigation using Large Language Models.

In current state there is one tool that allows bible verses from the Berean translation to be utilised.

There is one tool which allows a user to get verse and supply an Osis reference for that verse, e.g. John.3.16-18. The verses can be formatted as standard citations like Matt 3:1 and there is some tolerance to be loose with the format.

## Prompts

Prompts depend on the LLM used, with most LLMs you can use:

```
Get verse Matt.1.1 in greek
Get verse Gen.1.1 in hebrew
Get verse Gen.1.1 in english
Get verse Gen.1.1
```

With larger LLMs you can be more loose with language e.g:
```
Amos.1.1 in original language
```

## Bible versions

The text comes from the Berean Study Bible with original language coming from the following manuscript traditions: WLC / Nestle Base TR RP WH NE NA SBL.

## Installation / Build

To install the necessary dependencies, run:

```
npm install
```

The typescript routing layer can be rebuilt with:
```
npm run build
```

The unit tests can be run with:
```
npm test
```

## Usage

To test the mcp-server without an LLM you can use:
```
npx @modelcontextprotocol/inspector node build/mcp-server-stdio.js
```

For testing local mcp-server usage you can configure it to use this path via stdio:
```
[ABSOLUTE PATH TO]/mcp-server/build/mcp-server-stdio.js
```

To start the MCP server, execute the following command:

```
node src/mcp-server-stdio.js
```

The server will listen for incoming connections and handle MCP requests as defined in the MCPController using stdio.

## Using with Local LLMS / Open WebUI

If you want to use this with a Local Large Language Model via ollama (e.g. llama 3.1 8b) then you can launch open-webui via docker:

```
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

## Project Structure

```
mcp-server
├── src
│   ├── index.ts            # Entry point of the server
│   └── services
│       └── service.js      # A service
│       └── service.test.js # Tests for the service
├── package.json            # NPM configuration file
└── README.md               # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project source code is under the GNU GPL v3 Licence. Within the project there are data files that come under different licences.
