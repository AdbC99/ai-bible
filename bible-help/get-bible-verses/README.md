
# Get Bible Verses

Take a loosley formed list of one or more bible verses e.g"

``` json
[ "Gen.1.1-5", "Mark 1", "Heb.1.1-Heb.1.5"]
``` 

and either parse them into a list of osisReferences or retrieve the bible text using the bearean translation in either english, hebrew or greek. e.g.:

``` json
[
    "בְּרֵאשִׁ֖ית אֱלֹהִ֑ים אֵ֥ת בָּרָ֣א הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃.", 
    "הַשָּׁמַ֥יִם וְהָאָ֖רֶץ וַיְכֻלּ֛וּ וְכָל־ צְבָאָֽם׃."
]
```

This is useful for use cases involving AI / LLMs where you cannot guarantee getting the request perfectly formatted.

The text comes from the Berean Study Bible with original language coming from the following manuscript traditions: WLC / Nestle Base TR RP WH NE NA SBL.

This module includes the whole translation and so should not be used with serverless systems due to load times, but is effective for containers, instances and local use. If you want a slimmer library just for parsing verses then take a look at [bible-passage-reference-parser](https://www.npmjs.com/package/bible-passage-reference-parser)

## Associated Projects

For a interactive bible using the berean translation then take a look at:
[ai-BIBLE](http://ai-bible.com)

For a mcp-server (Model Context Protocol) that you plugin to Claude Desktop and use to lookup bible verses then have a look at:
[MPC-Server](https://github.com/AdbC99/ai-bible/tree/main/mcp-server)

For a completions api that you can use with Open WebUI or Chat GPT via the completions api then have a look at:
[Completions-API-Server](https://github.com/AdbC99/ai-bible/tree/main/completions)

## Install

``` bash
npm install @bible-help/get-bible-verses
```

## Usage

``` typescript
import { getListBibleVerses, parseBibleVerses } from "@bible-help/get-bible-verses";

// Get verses in English (default)
const verses = getListBibleVerses(["Gen.1.1", "John.3.16", "Matt.5.6"]);
console.log(verses);
// Output: [
//  "In the beginning God created the heavens and the earth.", 
//  "For God so loved the world...", 
//  "Blessed are those who hunger and thirst for righteousness..."
// ]

// Parse references to get individual verse list
const references = parseBibleVerses(["Gen.1.1-3", "John.3.16"]);
console.log(references);
// Output: ["Gen.1.1", "Gen.1.2", "Gen.1.3", "John.3.16"]

// Language Support

// Get verses in original Hebrew/Greek
const originalText = getListBibleVerses(["Gen.1.1", "John.1.1"], "hebrew");
console.log(originalText);
// Output: Array with Hebrew and Greek original text

// Get transliterated text
const transliteration = getListBibleVerses(["Gen.1.1", "John.1.1"], "transliteration");
console.log(transliteration);
// Output: Transliterated Hebrew/Greek text

// Alternative language parameters
const hebrewVerses = getListBibleVerses(["Gen.1.1-2"], "original-language");
const greekVerses = getListBibleVerses(["Matt.1.1"], "greek");
```