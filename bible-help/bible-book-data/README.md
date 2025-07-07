
# Bible Book Data

If you have a string that starts with the name of a book in the bible then this code will pick it up and convert it to a recognisable osis Name / book and is tolerant to some mispellings e.g:

```
Gen.1.1 -> Gen
Genesis -> Gen
Genessis -> Gen
```

Also lists of bible books can be obtained and book names can be converted into plain english or 3 digit book codes e.g:

```
Gen -> Genesis
Gen -> GEN
```

It provides a layer that can sit before tools like [bible-passage-reference-parser](https://www.npmjs.com/package/bible-passage-reference-parser) to increase it's tolerance to mispellings and different input formats.

## Associated Projects

For a interactive bible using the berean translation then take a look at:
[ai-BIBLE](http://ai-bible.com)

For a mcp-server (Model Context Protocol) that you plugin to Claude Desktop and use to lookup bible verses then have a look at:
[MPC-Server](https://github.com/AdbC99/ai-bible/tree/main/mcp-server)

For a completions api that you can use with Open WebUI or Chat GPT via the completions api then have a look at:
[Completions-API-Server](https://github.com/AdbC99/ai-bible/tree/main/completions)

## Install

``` bash
npm install @bible-help/bible-book-data
```

## Usage

``` typescript
import { isValidOsisBook, bookNameToOsisBook, osisBookToBookName, getAllOsisBooks, getAllBookNames, replaceBookNamesWithOsis } from "@bible-help/bible-book-data";

// Replace book names in string with osis formatted names
const withOsis = replaceBookNamesWithOsis("Read from Genesis:1");
console.log(withOsis)
// Output: "Read from Gen.1"

// Retrieve osis formatted book name
const osisName = bookNameToOsisBook("Genesis.3.16");
console.log(osisName);
// Output: "Gen"

const isValid = isValidOsisBook(osisName)
console.log(isValid)
// Output: true

// Retrieve osis formatted book name
const name = osisBookToBookName(osisName);
console.log(name);
// Output: "Genesis"

// Get all osis book names
const osisNames = getAllOsisBooks()
console.log(osisNames)
// Output: ["Gen", "Exod" ... "Rev"]

// Get all book names
const bookNames = getAllBookNames()
console.log(bookNames)
// Output: ["Genesis", "Exodus" ... "Revelation"]
```

## Licence

This project is licensed under the MIT License.
