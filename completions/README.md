# ai-BIBLE Completions

The ai BIBLE completions server provides tools for large language models like Chat GPT and local LLMs like llama to access bible date repeatably via the completions api.

## docker-container for completions 

The docker container wraps the mcp server up using mcpo in order to turn it into server supporting the openai completions api. You will need to run these commands from the project root, and have built the mcp-server already.

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

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
 
 This project source code is under the GNU GPL v3 Licence. Within the project there are data files that come under different licences. See the file LICENCE.md for details of the GPL licence.