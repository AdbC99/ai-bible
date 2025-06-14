//import berean_verses from "../data/berean/berean_verses.json" with { type: "json" };
//import * as converters from "./converters.js";
/**
 * Retrieves a list of Bible verses based on an OSIS range.
 *
 * @param {string} osisRange - The OSIS range to retrieve verses for (e.g. "Mt 1:1-5")
 * @returns {Promise<Verse[]>} A promise resolving to an array of Bible verse objects
 */
function getBibleVerses(osisRange) {
    // const indexes = converters.convertOsisRangeToOsisRefs(osisRange);
    // return indexes.map((index) => {
    //     /**
    //      * Retrieves a Bible verse range based on its OSIS reference.
    //      *
    //      * @param {string} osisRef - The OSIS reference of the verse to retrieve (e.g. "Mt 1:1")
    //      * @returns {array|null} A list of bible verses, or null if not found
    //      */
    //     return getBibleVerse(index);
    // });
    return null;
}
/**
 * Retrieves a single Bible verse based on its OSIS reference.
 *
 * @param {string} osisRef - The OSIS reference of the verse to retrieve (e.g. "Mt 1:1")
 * @returns {string|null} A bible verse as text, or null if not found
 */
function getBibleVerse(osisRef) {
    // const index = converters.convertOsisRefToIndex(osisRef);
    // return berean_verses.verses[index] || null;
    return null;
}
export { getBibleVerse, getBibleVerses };
