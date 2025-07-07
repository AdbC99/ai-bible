
# Chapters and Verses in Bible Books

Get information about chapters and verses in Bible books. This module provides functions to retrieve the number of chapters in a book, verses in a book, verses in a specific chapter, and convert OSIS references to verse indices.

## Associated Projects

For a interactive bible using the berean translation then take a look at:
[ai-BIBLE](http://ai-bible.com)

For a mcp-server (Model Context Protocol) that you plugin to Claude Desktop and use to lookup bible verses then have a look at:
[MPC-Server](https://github.com/AdbC99/ai-bible/tree/main/mcp-server)

For a completions api that you can use with Open WebUI or Chat GPT via the completions api then have a look at:
[Completions-API-Server](https://github.com/AdbC99/ai-bible/tree/main/completions)

## Install

``` bash
npm install @bible-help/chapters-and-verses-in-bible-books
```

## Usage

``` typescript
import { 
    getChaptersInBook, 
    getVersesInBook, 
    getVersesInChapter, 
    getIndexFromOsisRef 
} from "@bible-help/chapters-and-verses-in-bible-books";

// Get number of chapters in a book
const chaptersInGenesis = getChaptersInBook("Genesis");
console.log(chaptersInGenesis);
// Output: 50

const chaptersInGen = getChaptersInBook("Gen");
console.log(chaptersInGen);
// Output: 50

// Get total verses in a book
const versesInGenesis = getVersesInBook("Genesis");
console.log(versesInGenesis);
// Output: 1533

// Get verses in a specific chapter
const versesInPsalm119 = getVersesInChapter("Psalm", 119);
console.log(versesInPsalm119);
// Output: 176 (longest chapter in the Bible)

// Convert OSIS reference to verse index (0-based)
const index = getIndexFromOsisRef("Gen.1.1");
console.log(index);
// Output: 0 (first verse in the Bible)

const index2 = getIndexFromOsisRef("Gen.1.2");
console.log(index2);
// Output: 1

const index3 = getIndexFromOsisRef("Gen.2.1");
console.log(index3);
// Output: 31
```

## Examples with Different Book Name Formats

The functions accept various book name formats:

``` typescript
// Full book names
getChaptersInBook("Genesis");     // 50
getChaptersInBook("Matthew");     // 28
getChaptersInBook("Revelation");  // 22

// Common abbreviations
getChaptersInBook("Gen");         // 50
getChaptersInBook("Matt");        // 28
getChaptersInBook("Rev");         // 22

// Single chapter books
getChaptersInBook("Obadiah");     // 1
getVersesInBook("Obadiah");       // 21
getVersesInChapter("Obadiah", 1); // 21
```

## Error Handling

All functions return `undefined` for invalid inputs:

``` typescript
getChaptersInBook("InvalidBook");    // undefined
getVersesInChapter("Genesis", 999);  // undefined (chapter doesn't exist)
getIndexFromOsisRef("Invalid.Ref"); // undefined
```

## Licence

This project is licensed under the MIT License.
