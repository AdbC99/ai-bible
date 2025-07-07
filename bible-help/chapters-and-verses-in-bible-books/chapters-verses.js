import indexConversions from './data/index_conversions.json' with { type: "json" };
import chapterIndex from './data/chapter_index.json' with { type: "json" };
import bibleData from './data/bible_tables.json' with { type: "json" };
import { bcv_parser } from "bible-passage-reference-parser/esm/bcv_parser.js";
import { regexps, translations, grammar } from "bible-passage-reference-parser/esm/lang/en.js";
var bcv = new bcv_parser({ regexps, translations, grammar });

/**
 * Converts an OSIS reference to its corresponding verse index. A verse
 * index is a unique number representing a specific verse in the Bible.
 *
 * @param {string} osisRef - The OSIS reference to convert
 * @returns {number|undefined} The corresponding verse index (1 is Gen.1.1, 2 is Gen.1.2, etc.), or undefined if not found 
 */
function getIndexFromOsisRef(osisRef) { 
    if (!osisRef || typeof osisRef !== 'string') return undefined;
    const ref = bcv.parse(osisRef).osis();                  
    return indexConversions.osisRef[ref];
}

/**
 * Gets the number of chapters in a book of the Bible
 * @param {string} bookName - The name of the book (e.g., "Genesis", "Gen", "Matthew")
 * @returns {number|undefined} The number of chapters in the book, or undefined if not found
 */
function getChaptersInBook(bookName) {
    if (!bookName || typeof bookName !== 'string') return undefined;
    
    // Try direct lookup first (for full names like "Genesis")
    let bookAbbrev = bibleData.bookName2osis[bookName];
    
    // If not found, try as abbreviation (for short names like "Gen")
    if (!bookAbbrev) {
        bookAbbrev = bibleData.osis2bookName[bookName] ? bookName : undefined;
    }
    
    // If still not found, try parsing with a dummy reference
    if (!bookAbbrev) {
        const parsed = bcv.parse(bookName + ' 1:1').osis();
        if (parsed) {
            bookAbbrev = parsed.split('.')[0];
        }
    }
    
    if (!bookAbbrev) return undefined;
    
    // Count chapters by filtering chapter data
    const chapters = Object.keys(chapterIndex.versePerChapter)
        .filter(key => key.startsWith(bookAbbrev + '.'))
        .map(key => parseInt(key.split('.')[1]))
        .filter(chapterNum => !isNaN(chapterNum));
    
    return chapters.length > 0 ? Math.max(...chapters) : undefined;
}

/**
 * Gets the total number of verses in a book of the Bible
 * @param {string} bookName - The name of the book (e.g., "Genesis", "Gen", "Matthew")
 * @returns {number|undefined} The total number of verses in the book, or undefined if not found
 */
function getVersesInBook(bookName) {
    if (!bookName || typeof bookName !== 'string') return undefined;
    
    // Try direct lookup first (for full names like "Genesis")
    let bookAbbrev = bibleData.bookName2osis[bookName];
    
    // If not found, try as abbreviation (for short names like "Gen")
    if (!bookAbbrev) {
        bookAbbrev = bibleData.osis2bookName[bookName] ? bookName : undefined;
    }
    
    // If still not found, try parsing with a dummy reference
    if (!bookAbbrev) {
        const parsed = bcv.parse(bookName + ' 1:1').osis();
        if (parsed) {
            bookAbbrev = parsed.split('.')[0];
        }
    }
    
    if (!bookAbbrev) return undefined;
    
    // Sum all verses from all chapters in the book
    const totalVerses = Object.entries(chapterIndex.versePerChapter)
        .filter(([key]) => key.startsWith(bookAbbrev + '.'))
        .reduce((total, [, verseCount]) => total + verseCount, 0);
    
    return totalVerses > 0 ? totalVerses : undefined;
}

/**
 * Gets the number of verses in a specific chapter of the Bible
 * @param {string} bookName - The name of the book (e.g., "Genesis", "Gen", "Matthew")
 * @param {number} chapterNum - The chapter number (1-based)
 * @returns {number|undefined} The number of verses in the chapter, or undefined if not found
 */
function getVersesInChapter(bookName, chapterNum) {
    if (!bookName || typeof bookName !== 'string' || !chapterNum || typeof chapterNum !== 'number') return undefined;
    
    // Try direct lookup first (for full names like "Genesis")
    let bookAbbrev = bibleData.bookName2osis[bookName];
    
    // If not found, try as abbreviation (for short names like "Gen")
    if (!bookAbbrev) {
        bookAbbrev = bibleData.osis2bookName[bookName] ? bookName : undefined;
    }
    
    // If still not found, try parsing with a dummy reference
    if (!bookAbbrev) {
        const parsed = bcv.parse(bookName + ' 1:1').osis();
        if (parsed) {
            bookAbbrev = parsed.split('.')[0];
        }
    }
    
    if (!bookAbbrev) return undefined;
    
    // Look up the specific chapter
    const chapterKey = `${bookAbbrev}.${chapterNum}`;
    return chapterIndex.versePerChapter[chapterKey];
}

export {
    getIndexFromOsisRef,
    getChaptersInBook,
    getVersesInBook,
    getVersesInChapter
};