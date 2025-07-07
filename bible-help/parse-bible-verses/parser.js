import tables from './data/clarkson/bible_tables.json' with { type: "json" };
import indexConversions from './data/clarkson/index_conversions.json' with { type: "json" };
import chapterIndexTable from "./data/clarkson/chapter_index.json" with { type: "json" };
import { isValidOsisBook, replaceBookNamesWithOsis } from "@bible-help/bible-book-data";
import logger from "./logger.js";
import * as bcv_parser from "bible-passage-reference-parser/js/en_bcv_parser.js";
var bcv = new bcv_parser.default.bcv_parser();

/**
 * Converts an OSIS chapter to a list of verses.
 * @param {string} osisChapter - The OSIS chapter reference
 * @returns {string[]} The list of verse numbers as OSIS references
 */
function convertOsisChapterToOsisRefs(osisChapter) {
    osisChapter = replaceBookNamesWithOsis(osisChapter); // Ensure osisChapter is in the correct format

    const chapterIndex = indexConversions.osisChapter[osisChapter];
    const versesFound = chapterIndexTable.versePerChapter[osisChapter];

    if (!versesFound) {
        logger.error(`Unrecognised chapter: ${osisChapter} ${chapterIndex}`);
        return [];
    }

    let index = 1;
    let listOfVerses = new Array(versesFound).fill(osisChapter); 

    
    listOfVerses = listOfVerses.map(verse =>
        {
            return verse + index++
        }
    );

    return listOfVerses;
}

/**
 * Expands an OSIS reference to include verse ranges.
 *
 * @param {string} osisRef - The OSIS reference to expand (e.g., "Gen.1.1-3")
 * @returns {string} The expanded OSIS reference with verse ranges (e.g., "Gen.1.1-Gen.1.3")
 */
function expandOsisRef(osisRef) {
    osisRef = replaceBookNamesWithOsis(osisRef); // Ensure osisRef is in the correct format

    const parts = osisRef.split('.');

    // check if osis book is valid
    const book = parts[0];

    logger.debug(`Expanding OSIS reference: ${osisRef} with parts: ${JSON.stringify(parts)} found book: ${book}`);

    if (!isValidOsisBook(book)) return null;

    if (parts.length === 5)
    {
        const [book, , verseRange] = parts;
        let [, endBook] = verseRange.split('-');

        if (book != endBook) {
            return null; // Invalid range across different books
        }   

        return osisRef; // Already expanded, e.g., "Gen.1.1-Gen.1.3"
    }
    if (parts.length === 3 && !osisRef.includes('-')) { // Single verse reference e.g. // "Gen.1.1"
        return osisRef; // No expansion needed for single verse reference
    }
    else if (parts.length === 3 && parts[2].includes('-')) {
        const [book, chapter, verseRange] = parts;
        const startVerse = verseRange.split('-')[0];
        const endVerse = verseRange.split('-')[1] || 1;
        const expanded = `${book}.${chapter}.${startVerse}-${book}.${chapter}.${endVerse}`;
        return expanded;
    } else if (parts.length === 3 && parts[1].includes('-') ) {
        const [book, chapterRange, verseRange] = parts;
        let [startChapter, endChapter] = chapterRange.split('-');
        let startVerse = 1; // Default to verse 1 if not specified
        let endVerse = verseRange || startVerse; // If no end verse, use start verse

        if (!/^\d{1,2}$/.test(endChapter)) // If endChapter is not a valid number, assume it's a book and the same as startChapter
        {
            endChapter = verseRange;
            endVerse = convertOsisChapterToOsisRefs(book + '.' + endChapter).length;
        }

        const expanded = `${book}.${startChapter}.${startVerse}-${book}.${endChapter}.${endVerse}`;
        return expanded;
    } else if (parts.length === 4 && parts[2].includes('-')) {
        const [book, startChapter, verseRange, endVerse] = parts;
        const endChapter = verseRange.split('-')[1] || startChapter; // Default to start chapter if not specified
        const startVerse = verseRange.split('-')[0] || 1; // Default to verse 1 if not specified
        const expanded = `${book}.${startChapter}.${startVerse}-${book}.${endChapter}.${endVerse}`;
        return expanded;
    } else if (parts.length === 2 && !parts[1].includes('-')) {
        const [book, startChapter] = parts;
        const startVerse = 1; // Default to verse 1 if not specified
        const endChapter = startChapter; // Default to start chapter if not specified
        const endVerse = convertOsisChapterToOsisRefs(osisRef).length
        const expanded = `${book}.${startChapter}.${startVerse}-${book}.${endChapter}.${endVerse}`;
        return expanded;
    } else if (parts.length === 1) {
        // If only the book is provided, assume the first chapter and verse
        const book = parts[0];
        if (!isValidOsisBook(book)) {
            logger.error(`Invalid OSIS book: ${book}`);
            return null;
        }
        // TODO: Get proper end chapter and verse for the book
        return `${book}.1.1-${book}.1.${convertOsisChapterToOsisRefs(book + '.1').length}`;
    }

    return null;
}

/**
 * Converts an OSIS reference range (e.g., "Gen.1.1-Gen.1.3") to a list of individual verses.
 * @param {string} osisRefRange - The OSIS reference range to convert.
 * @returns {Array<string>} - An array of individual OSIS references.
 */
function convertOsisRangeToOsisRefs(osisRefRange) {
    if (!osisRefRange || typeof osisRefRange !== 'string') {
        logger.error(`Invalid OSIS reference range: ${JSON.stringify(osisRefRange)}`);
        return [];
    } 

    osisRefRange = replaceBookNamesWithOsis(osisRefRange); // Ensure osisRefRange is in the correct format
    osisRefRange = osisRefRange.split('\\').join("").trim(); // Clean off escape characters and trim whitespace

    let range = bcv.parse(osisRefRange).osis(); 

    logger.debug(`Converting OSIS reference range: ${osisRefRange} parsed as: ${range}`);

    if (range === null || range === undefined || range === '') {
        logger.debug(`Invalid OSIS reference range: ${osisRefRange} - ${range}`);
        // try adding .1 to see if it is a book reference
        range = bcv.parse(osisRefRange + '.1').osis();
        if (range === null || range === undefined || range === '') {
            logger.error(`Invalid OSIS reference range after adding .1: ${osisRefRange} - ${range}`);
            return [];
        }
        else {            
            const book = range.split('.')[0];
            const start_chapter = 1;
            const end_chapter = tables.osisName2osisChapters[book].length;
            range = `${book}.${start_chapter}-${book}.${end_chapter}`;
        }
    }
    
    logger.debug(`Converted OSIS reference range: ${osisRefRange} parsed as: ${range}`);

    // Expand the OSIS reference range to handle cases like "Gen.1.1-3"
    const expandedRange = expandOsisRef(range);

    logger.debug(`Expanded OSIS reference range: ${osisRefRange} expanded as: ${expandedRange}`);


    if (!expandedRange || expandedRange.length === 0) {
        return [];
    }

    var refs = expandedRange.split('-');

    if (refs.length == 1)
        return [range];

    var start = refs[0].split('.');
    var end = refs[1].split('.');
    
    var start_book = start[0];
    var start_chapter = parseInt(start[1]);
    var start_verse = parseInt(start[2]);
    var end_book = end[0];
    var end_chapter = parseInt(end[1]);
    var end_verse = parseInt(end[2]);

    if (start_book != end_book)
        return [start_book + "." + start_chapter + "." + start_verse];

    var verses_out = [];
    for (var c = start_chapter; c <= end_chapter; c++)
    {
        if (c == end_chapter)
        {
            if (start_chapter != end_chapter)
                start_verse = 1;

            for (var v = start_verse; v <= end_verse; v++)
            {
                var osis = start_book + "." + c + "." + v;
                verses_out.push(osis);
            }
        }
        else
        {
            var verses = convertOsisRangeToOsisRefs(start_book + "." + c);

            if (start_verse > 0)
            {
                for (var v = start_verse - 1; v < verses.length; v++)
                {
                    verses_out.push(verses[v]);
                }
            }
        }
    }

    return verses_out;
}

function isSplitBibleReference(first, second) {
    if (!first || !second) return false;
    
    // Check if first looks like a book name
    const bookPattern = /^(\d+\s?)?\w+$/; // Matches "Gen", "Genesis", "1John", "2 Cor", etc.
    
    // Check if second looks like a chapter:verse or chapter.verse
    const refPattern = /^\d+[:.]\d+(\.\d+)*$|^\d+$/; // Matches "1.1", "1:1", "1.1.5", "5"
    
    const result = bookPattern.test(first) && refPattern.test(second);

    logger.info(`isSplitBibleReference: first=${first}, second=${second}, result=${result}`);

    return result;
}

function fixCommaInOsisRef(ref) {
    if (typeof ref !== 'string') return ref;
    
    // Check if it has a comma and looks like book,chapter or book,chapter.verse
    if (ref.includes(',') && /^[A-Za-z0-9]+,\d+/.test(ref)) {
        return ref.replace(',', '.');
    }
    
    return ref;
}

function detectAndMergeBibleRefs(arr) {
    const result = [];
    let i = 0;

    logger.info(`detectAndMergeBibleRefs called with: ${arr} ${arr.length} items`);
    
    while (i < arr.length) {
        const current = arr[i];
        const next = arr[i + 1];

        logger.info(`Processing item ${i}: current=${current}, next=${next}`);
        
        // Check if current and next form a Bible reference
        if (isSplitBibleReference(current, next)) {
            // Merge them
            const merged = mergeBibleRef([current, next]);
            result.push(merged);
            i += 2; // Skip the next item since we merged it
        } else {
            // Keep as-is
            result.push(current);
            i += 1;
        }
    }
    
    return result;
}

function mergeBibleRef(arr) {
    const [book, reference] = arr;
    return reference.includes(':') ? `${book} ${reference}` : `${book}.${reference}`;
}


/**
 * Normalizes input to ensure it's an array of strings.
 *
 * @param {any} input - The input to normalize
 * @returns {Array<string>|null} Normalized array or null if invalid
 */
function normalizeInputToArray(input) {
    if (!input) return null;

    if (Array.isArray(input)) {
        return input;
    }

    // Convert to string and clean escape characters
    let cleanedInput = input.toString().trim();
    cleanedInput = cleanedInput.replace(/\\/g, "");
    cleanedInput = cleanedInput.split("\\").join("");

    logger.debug(`Cleaned input: ${cleanedInput}`);

    // Try to parse as JSON array
    if (cleanedInput.startsWith("[") && cleanedInput.endsWith("]")) {
        try {
            return JSON.parse(cleanedInput);
        } catch (error) {
            logger.error("Error parsing JSON:", error);
            return null;
        }
    }

    // Single item - convert to array
    return [cleanedInput];
}

/**
 * Processes array items to ensure they are properly formatted strings.
 *
 * @param {Array} items - Array of items to process
 * @returns {Array<string>} Processed array of strings
 */
function processArrayItems(items) {
    return items.map(item => {
        logger.debug(`Processing item: |${JSON.stringify(item)}| of type: ${typeof item}`);
        
        // If it's already an array, flatten it
        if (Array.isArray(item)) {
            return item.flat(Infinity);
        }
        
        try {
            let parsed = JSON.parse(item);
            // Handle nested arrays by flattening them
            if (Array.isArray(parsed)) {
                return parsed.flat(Infinity);
            }
            return fixCommaInOsisRef(item.split('\\').join("").trim());
        } catch (e) {
            logger.error(`Error parsing item: |${JSON.stringify(item)}|, using as is. Error: ${e}`);
            return fixCommaInOsisRef(item + "").split('\\').join("").trim();
        }
    });
}

/**
 * Parses Bible verse ranges and returns the corresponding list of verses.
 *
 * @param {Array<string>} listOsisRanges - The lists of OSIS ranges to parse (e.g. ["Matt 1:1-5","Gen.1.1"])
 * @param {string} language - The language for parsing (default: "english")
 * @returns {Array<string>|null} Array of verses or null if invalid input
 */
function parseBibleVerses(listOsisRanges, language = "english") {
    logger.info(`parseBibleVerses called with: ${listOsisRanges} and language: ${language} type: ${typeof listOsisRanges} ${Array.isArray(listOsisRanges)}`);

    // Normalize input to array in case it wasn't called with an array
    let normalizedRanges = normalizeInputToArray(listOsisRanges);
    if (!normalizedRanges) {
        return null;
    }

    // Process array items to ensure proper formatting
    normalizedRanges = processArrayItems(normalizedRanges);
    logger.debug(`Processed ranges: ${normalizedRanges} length ${normalizedRanges.length}`);

    // Detect and merge split Bible references
    normalizedRanges = detectAndMergeBibleRefs(normalizedRanges);
    logger.debug(`Merged ranges: ${normalizedRanges} length ${normalizedRanges.length}`);

    // Flatten any remaining nested arrays
    normalizedRanges = normalizedRanges.flat();
    logger.debug(`Flattened ranges: ${normalizedRanges} length ${normalizedRanges.length}`);

    // Convert OSIS ranges to verse indexes
    let indexes = [];
    normalizedRanges.forEach((osisRange) => {
        logger.debug(`Processing OSIS range: |${osisRange}| of type: ${typeof osisRange}`);
        indexes = indexes.concat(convertOsisRangeToOsisRefs(osisRange, language));
    });

    logger.debug(`Indexes: ${indexes}`);

    return indexes;
}


export { 
    parseBibleVerses,
    convertOsisChapterToOsisRefs,
    convertOsisRangeToOsisRefs,
    expandOsisRef
};
