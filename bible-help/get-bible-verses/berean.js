import berean_verses from "./data/berean/berean_verses.json" with { type: "json" };
import berean_originaltext from "./data/berean/berean_originaltext.json" with { type: "json" };
import berean_transliteration from "./data/berean/berean_transliteration.json" with { type: "json" };
import * as converters from "./converters.js";
import logger from "./logger.js";

const berean_translit = berean_transliteration['berean-transliteration'];
const berean_original = berean_originaltext['berean-original-language'];

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

function ensureProperEncoding(text) {
    // Check if text is properly encoded
    try {
        // Test for Hebrew characters
        const hasHebrew = /[\u0590-\u05FF]/.test(text);
        const hasGreek = /[\u0370-\u03FF\u1F00-\u1FFF]/.test(text);
        
        if (hasHebrew || hasGreek) {
            return text; // Already properly encoded
        }
        
        // If it's Unicode escaped, decode it
        if (/\\u[0-9a-fA-F]{4}/.test(text)) {
            return JSON.parse(`"${text}"`);
        }
        
        return text;
    } catch (error) {
        console.warn('Encoding issue:', error);
        return text;
    }
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
        indexes = indexes.concat(converters.convertOsisRangeToOsisRefs(osisRange, language));
    });

    logger.debug(`Indexes: ${indexes}`);

    return indexes;
}

/**
 * Retrieves a list of Bible verses based on an OSIS range.
 *
 * @param {Array<string>} listOsisRanges - The lists of OSIS ranges to retrieve verses for (e.g. ["Matt 1:1-5","Gen.1.1"])
 * @returns {Promise<Verse[]>} A promise resolving to an array of Bible verse objects
 */
function getListBibleVerses(listOsisRanges, language = "english") {
    const indexes = parseBibleVerses(listOsisRanges, language);
    
    if (!indexes) {
        return null;
    }

    // Retrieve verses for each index
    return indexes.map((index) => getBibleVerse(index, language));
}

/**
 * Retrieves a list of Bible verses based on an OSIS range.
 *
 * @param {string} osisRange - The OSIS range to retrieve verses for (e.g. "Matt 1:1-5")
 * @returns {Promise<Verse[]>} A promise resolving to an array of Bible verse objects
 */
function getBibleVerses(osisRange, language = "english") {
    const indexes = converters.convertOsisRangeToOsisRefs(osisRange);

    return indexes.map((index) => {
        /**
         * Retrieves a Bible verse range based on its OSIS reference.
         *
         * @param {string} osisRef - The OSIS reference of the verse to retrieve (e.g. "Mt 1:1")
         * @returns {array|null} A list of bible verses, or null if not found
         */
        return getBibleVerse(index, language);
    });
}

/**
 * Retrieves a list of Bible verses based on an OSIS range.
 *
 * @param {string} osisRange - The OSIS range to retrieve verses for (e.g. "Mt 1:1-5")
 * @returns {Promise<Verse[]>} A promise resolving to an array of Bible verse objects
 */
function getOriginalTextVerses(osisRange) {
    const indexes = converters.convertOsisRangeToOsisRefs(osisRange);

    logger.info(`Indexes: ${indexes}`);

    return indexes.map((index) => {
        /**
         * Retrieves a Bible verse range based on its OSIS reference.
         *
         * @param {string} osisRef - The OSIS reference of the verse to retrieve (e.g. "Mt 1:1")
         * @returns {array|null} A list of bible verses, or null if not found
         */
        return getOriginalTextVerse(index);
    });
}

/**
 * Retrieves a list of Bible verses with transliterated original text based on an OSIS range.
 *
 * @param {string} osisRange - The OSIS range to retrieve verses for (e.g. "Mt 1:1-5")
 * @returns {Promise<Verse[]>} A promise resolving to an array of Bible verse objects
 */
function getTransliteratedVerses(osisRange) {
    const indexes = converters.convertOsisRangeToOsisRefs(osisRange);

    logger.info(`Indexes: ${indexes}`);

    return indexes.map((index) => {
        /**
         * Retrieves a Bible verse range based on its OSIS reference.
         *
         * @param {string} osisRef - The OSIS reference of the verse to retrieve (e.g. "Mt 1:1")
         * @returns {array|null} A list of bible verses, or null if not found
         */
        return getTransliteratedVerse(index);
    });
}

/**
 * Retrieves a single Bible verse based on its OSIS reference.
 *
 * @param {string} osisRef - The OSIS reference of the verse to retrieve (e.g. "Matt.1.1")
 * @returns {string|null} A bible verse as text, or null if not found
 */
function getBibleVerse(osisRef, language = "english") {
    const index = converters.convertOsisRefToIndex(osisRef);

    switch (language.toLowerCase()) {
        case "english":
            return berean_verses.verses[index] || null;
        case "hebrew":
        case "original-language":
        case "greek":
        case "original":
            return getOriginalTextVerse(osisRef)
        case "transliteration":
            return getTransliteratedVerse(osisRef);
        default:
            return berean_verses.verses[index] || null;
    }
}

/**
 * Retrieves a single Bible verse in original text based on its OSIS reference.
 *
 * @param {string} osisRef - The OSIS reference of the verse to retrieve (e.g. "Mt 1:1")
 * @returns {string|null} A bible verse as text, or null if not found
 */
function getOriginalTextVerse(osisRef) {
    const index = converters.convertOsisRefToIndex(osisRef);
    let verse = berean_original[index] || null;

    if (verse)
        verse = JSON.parse(`"${verse}"`);

    return verse;
}

/**
 * Retrieves a single Bible verse in transliterated original text based on its OSIS reference.
 *
 * @param {string} osisRef - The OSIS reference of the verse to retrieve (e.g. "Mt 1:1")
 * @returns {string|null} A bible verse as text, or null if not found
 */
function getTransliteratedVerse(osisRef) {
    const index = converters.convertOsisRefToIndex(osisRef);
    let verse = berean_translit[index] || null;

    if (verse)
        verse = JSON.parse(`"${verse}"`);

    return verse;
}

export { getBibleVerse, getBibleVerses, getListBibleVerses, parseBibleVerses, getOriginalTextVerses, getOriginalTextVerse, getTransliteratedVerse, getTransliteratedVerses };
