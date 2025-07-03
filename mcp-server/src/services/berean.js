import berean_verses from "../data/berean/berean_verses.json" with { type: "json" };
import berean_originaltext from "../data/berean/berean_originaltext.json" with { type: "json" };
import berean_transliteration from "../data/berean/berean_transliteration.json" with { type: "json" };
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
 * Retrieves a list of Bible verses based on an OSIS range.
 *
 * @param {Array<string>} listOsisRanges - The lists of OSIS ranges to retrieve verses for (e.g. ["Matt 1:1-5","Gen.1.1"])
 * @returns {Promise<Verse[]>} A promise resolving to an array of Bible verse objects
 */
function getListBibleVerses(listOsisRanges, language = "english") {
    if (!listOsisRanges)
        return null;

    logger.info(`getListBibleVerses called with: ${listOsisRanges} and language: ${language} type: ${typeof listOsisRanges} ${Array.isArray(listOsisRanges)}`);

    // If listOsisRanges is not an array, convert it to an array
    if (!Array.isArray(listOsisRanges)) {
        listOsisRanges = listOsisRanges.toString().trim();
        listOsisRanges = listOsisRanges.replace(/\\/g, ""); // clean off escape characters
        listOsisRanges = listOsisRanges.split("\\").join(""); // clean off escape characters

        logger.info(`Cleaned listOsisRanges: ${listOsisRanges}`);

        if (listOsisRanges.startsWith("[") && listOsisRanges.endsWith("]")) {
            // If the input is a string that looks like a JSON array, parse it
            try {
                listOsisRanges = JSON.parse(listOsisRanges);
            } catch (error) {
                logger.debug("Error parsing JSON:", error);
                return null;
            }
        } else {
            // If the input is a single OSIS range, convert it to an array
            listOsisRanges = [listOsisRanges];
        }        
    }

    // Ensure all items in listOsisRanges are true strings and not stringified JSON
    listOsisRanges = listOsisRanges.map(str => {
        logger.debug(`Processing OSIS range: |${JSON.stringify(str)}| of type: ${typeof str} from ${listOsisRanges}`);
        
        // If it's already an array, return it as-is
        if (Array.isArray(str)) {
            return str.flat(Infinity);
        }
        
        try {
            let parsed = JSON.parse(str);
            // Handle nested arrays by flattening them
            if (Array.isArray(parsed)) {
                return parsed.flat(Infinity);
            }
            return fixCommaInOsisRef(str.split('\\').join("").trim());
        } catch (e) {
            logger.error(`Error parsing OSIS range: |${JSON.stringify(str)}|, using as is. Error: ${e}`);
            return fixCommaInOsisRef(str + "").split('\\').join("").trim();
        }
    });

    logger.info(`Parsed listOsisRanges: ${listOsisRanges} length ${listOsisRanges.length} of array: ${Array.isArray(listOsisRanges)}`);

    // Detect and merge split Bible references
    listOsisRanges = detectAndMergeBibleRefs(listOsisRanges);

    logger.debug(`Merged listOsisRanges: ${listOsisRanges} length ${listOsisRanges.length}`);

    listOsisRanges = listOsisRanges.flat();

    logger.debug(`Flattened listOsisRanges: ${listOsisRanges} length ${listOsisRanges.length} stringified: ${JSON.stringify(listOsisRanges)}`);

    let indexes = [];
    listOsisRanges.map((osisRange) => {
        logger.debug(`Processing OSIS range: |${osisRange}| of type: ${typeof osisRange} from ${listOsisRanges}`);
        indexes = indexes.concat(converters.convertOsisRangeToOsisRefs(osisRange, language));
    });

    logger.debug(`Indexes: ${indexes}`);

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
 * @param {string} osisRef - The OSIS reference of the verse to retrieve (e.g. "Mt 1:1")
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

export { getBibleVerse, getBibleVerses, getListBibleVerses, getOriginalTextVerses, getOriginalTextVerse, getTransliteratedVerse, getTransliteratedVerses };
