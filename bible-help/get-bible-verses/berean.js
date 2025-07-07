import berean_verses from "./data/berean/berean_verses.json" with { type: "json" };
import berean_originaltext from "./data/berean/berean_originaltext.json" with { type: "json" };
import berean_transliteration from "./data/berean/berean_transliteration.json" with { type: "json" };
import logger from "./logger.js";
import { parseBibleVerses } from "@bible-help/parse-bible-verses";
import { getIndexFromOsisRef } from "@bible-help/chapters-and-verses-in-bible-books";

const berean_translit = berean_transliteration['berean-transliteration'];
const berean_original = berean_originaltext['berean-original-language'];

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
    const indexes = parseBibleVerses([osisRange], language);

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
    const indexes = parseBibleVerses([osisRange]);

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
    const indexes = parseBibleVerses([osisRange]);

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
    const index = getIndexFromOsisRef(osisRef);

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
    const index = getIndexFromOsisRef(osisRef);
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
    const index = getIndexFromOsisRef(osisRef);
    let verse = berean_translit[index] || null;

    if (verse)
        verse = JSON.parse(`"${verse}"`);

    return verse;
}

export { getBibleVerse, getBibleVerses, getListBibleVerses, getOriginalTextVerses, getOriginalTextVerse, getTransliteratedVerse, getTransliteratedVerses };
