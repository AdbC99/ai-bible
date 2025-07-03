# ai-Bible

ai-Bible is a project that explores the use of AI within a context of interpreting and understanding biblical text. This repository contains mcp-servers and a container for compatibility with the openai completions API that support an AI or Large Language Model reliably and repeatably lookup data so that it can be represented in different forms for research or educational purposes with some confidence that results will be reproducable and reasonable.

For web accessible front end as a pocket bible see http://ai-bible.com

<div align="left">
  <img src="https://www.ai-bible.com/ChristLandscape.jpg" alt="Logo" width="500">
</div>

## mcp-server for Claude etc

The mcp-server contains the current implementation of a server for repeatedly and reliably retrieving bible verses when using LLMs. Claude Desktop can be configured to use the mcp-server.stdio.js file built in the build folder of this project as an mcp-server.

See the README.md in that subfolder for detailed information.

## docker-container for completions 

The docker container wraps the mcp server up using mcpo in order to turn it into server supporting the openai completions api. Run these commands from the project root after building the mcp-server.

```
docker build -f completions/Dockerfile -t mcp-server .
docker run -p 8002:8000 mcp-server
```

You can check it is running be checking the swagger api page:
```
http://localhost:8002/docs

Try the get-verse api with parameters:
{
  "reference": ["Gen.1.1", "Gen.2.1"],
  "language": "english"
}
```

One way to access the completions api is via Open WebUI and then you can do everything locally with a LLM via Ollama with a model such as llama 3.1 8b, see:
```
https://docs.openwebui.com/getting-started/quick-start/
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
 
 This project source code is under the GNU GPL v3 Licence. Within the project there are data files that come under different licences. See the file LICENCE.md for details of the GPL licence.
