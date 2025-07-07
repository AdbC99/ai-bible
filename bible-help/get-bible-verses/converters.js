import indexConversions from './data/clarkson/index_conversions.json' with { type: "json" };
import * as bcv_parser from "bible-passage-reference-parser/js/en_bcv_parser.js";
var bcv = new bcv_parser.default.bcv_parser();

/**
 * Converts an OSIS reference to its corresponding verse index.
 *
 * @param {string} osisRef - The OSIS reference to convert
 * @returns {number|undefined} The corresponding verse index (1 is Gen.1.1, 2 is Gen.1.2, etc.), or undefined if not found 
 */
function convertOsisRefToIndex(osisRef) { 
    if (!osisRef || typeof osisRef !== 'string') return undefined;
    const ref = bcv.parse(osisRef).osis();                  
    return indexConversions.osisRef[ref];
}

export {
    convertOsisRefToIndex,
};