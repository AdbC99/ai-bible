# ai-bible-mcp-server

This project contains open source tooling from ai-Bible. Currenty it contains an mcp-server which is intended to provided a repeatable and reliable source of information for bible investigation using Large Language Models.

In current state there is one tool that allows bible verses from the Berean translation to be utilised.

There is one tool which allows a user to get verse and supply an Osis reference for that verse, e.g. John.3.16-18

## Bible versions

The text comes from the Berean Study Bible with original language coming from the following manuscript traditions: WLC / Nestle Base TR RP WH NE NA SBL.

## Installation

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
npx @modelcontextprotocol/inspector node build/index.js
```

For testing local mcp-server usage you can configure it to use this path via stdio:
```
[ABSOLUTE PATH TO]/mcp-server/build/index.js
```

To start the MCP server, execute the following command:

```
node src/server.js
```

The server will listen for incoming connections and handle MCP requests as defined in the MCPController using stdio.

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