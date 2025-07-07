
# Parse Bible Verses

Step 1. Take a string with bible verses in it and get a list of bible references back

``` json
"Read Genesis 1:1-2 and Matt.1.1 and Hebrews.1.1-2"
```

results in this response

``` json
{
    "text": "Read Gen.1.1-Gen.1,2 and Matt.1.1 and Heb.1.1-Heb.1.2",
    "references": [ "Gen.1.1-2", "Matthew 1:1", "Heb.1.1-Heb.1.2"]
}
``` 

Step 2. expand them into a list of osis bible verse references e.g.:

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

### Basic Reference Parsing

``` typescript
import { expandBibleVerses } from "@bible-help/parse-bible-verses";

// Parse references to get individual verse list
const references = expandBibleVerses(["Gen.1.1-3", "John.3.16"]);
console.log(references);
// Output: ["Gen.1.1", "Gen.1.2", "Gen.1.3", "John.3.16"]
```

### Text Processing with Bible References

``` typescript
import { parseTextForBibleVerses } from "@bible-help/parse-bible-verses";

// Parse text and replace Bible references with OSIS format
const result = parseTextForBibleVerses("Read John 3:16 and Matthew 5:3-4 for hope.");
console.log(result);
// Output: {
//   text: "Read John.3.16 and Matt.5.3-Matt.5.4 for hope.",
//   references: ["John.3.16", "Matt.5.3-Matt.5.4"]
// }

// Handle various book name formats
const result2 = parseTextForBibleVerses("Study Psalms 23 for comfort.");
console.log(result2);
// Output: {
//   text: "Study Ps.23.1-Ps.23.6 for comfort.",
//   references: ["Ps.23.1-Ps.23.6"]
// }
```

### Book Name Recognition

``` typescript
import { isRecognisedBook } from "@bible-help/parse-bible-verses";

// Check if a book name is recognized (more flexible than standard OSIS validation)
console.log(isRecognisedBook("Genesis"));     // true
console.log(isRecognisedBook("Psalms"));      // true (handles variations)
console.log(isRecognisedBook("1 John"));      // true (handles numbered books)
console.log(isRecognisedBook("genessis"));    // true (handles misspellings)
console.log(isRecognisedBook("InvalidBook")); // false
```

## API Reference

### `expandBibleVerses(references: string[], language?: string): string[]`

Expands an array of Bible verse references and returns individual verse references in OSIS format.

**Parameters:**
- `references`: Array of Bible verse references in various formats
- `language`: Optional language parameter (default: "english")

**Returns:** Array of individual OSIS verse references

### `parseTextForBibleVerses(text: string): { text: string, references: string[] }`

Parses text for Bible verse references and replaces them with OSIS formatted references.

**Parameters:**
- `text`: Input text containing Bible verse references

**Returns:** Object containing:
- `text`: Processed text with Bible references replaced with OSIS format
- `references`: Array of OSIS reference ranges found, sorted naturally

**Supported Formats:**
- Standard references: "John 3:16", "Matt 5:3-4"
- Numbered books: "1 John 2:1", "2 Cor 3:16"
- Chapter references: "Matthew 5", "Psalms 23"
- Book name variations: "Psalms", "Genesis"
- Dot notation: "Gen.1.1", "John.3.16"

### `isRecognisedBook(bookName: string): boolean`

Checks if a book name is recognized in any format (more permissive than standard OSIS validation).

**Parameters:**
- `bookName`: Book name to validate

**Returns:** Boolean indicating if the book name is recognized

**Supported Formats:**
- OSIS codes: "Gen", "John", "1John"
- Full names: "Genesis", "Matthew", "Revelation"
- Common variations: "Psalms", "Pss"
- Case variations: "genesis", "JOHN"
- Misspellings and overrides: "genessis" → "Genesis"

## Licence

This project is licensed under the MIT License.
