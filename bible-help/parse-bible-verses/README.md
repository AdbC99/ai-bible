
# Parse Bible Verses

Take a loosley formed list of one or more bible verses e.g:

``` json
[ "Gen.1.1-2", "Matthew 1:1", "Heb.1.1-Heb.1.2"]
``` 

and parse them into a list of osis bible verse references e.g.:

``` json
[
    "Gen.1.1",
    "Gen.1.2",
    "Matt.1.1",
    "Heb.1.1",
    "Heb.1.2"
]
```

This is useful for use cases involving AI / LLMs where you cannot guarantee getting a request that is perfectly formatted.

 If you want a slimmer library just for parsing verses then take a look at [bible-passage-reference-parser](https://www.npmjs.com/package/bible-passage-reference-parser) which is used under the hood by this library.

## Associated Projects

For a interactive bible using the berean translation then take a look at:
[ai-BIBLE](http://ai-bible.com)

For a mcp-server (Model Context Protocol) that you plugin to Claude Desktop and use to lookup bible verses then have a look at:
[MPC-Server](https://github.com/AdbC99/ai-bible/tree/main/mcp-server)

For a completions api that you can use with Open WebUI or Chat GPT via the completions api then have a look at:
[Completions-API-Server](https://github.com/AdbC99/ai-bible/tree/main/completions)

## Install

``` bash
npm install @bible-help/parse-bible-verses
```

## Usage

``` typescript
import { parseBibleVerses } from "@bible-help/parse-bible-verses";

// Parse references to get individual verse list
const references = parseBibleVerses(["Gen.1.1-3", "John.3.16"]);
console.log(references);
// Output: ["Gen.1.1", "Gen.1.2", "Gen.1.3", "John.3.16"]
```

## Licence

This project is licensed under the MIT License.
