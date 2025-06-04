import tables from '../data/clarkson/bible_tables.json' with { type: "json" };
import indexConversions from '../data/clarkson/index_conversions.json' with { type: "json" };
import chapterIndexTable from "../data/clarkson/chapter_index.json" with { type: "json" };

/**
 * Converts a Unity lookup string to an OSIS chapter reference.
 *
 * @param {string} unityLookups - The Unity lookup string to convert
 * @returns {string} The converted OSIS chapter reference
 */
function convertUnityLookupToOsisChapter(unityLookups) {
    let lookups = unityLookups;
    const unityLookup = lookups.split(':');

    if (unityLookup.length > 1) {
        const lookup = unityLookup[0];
        lookups = `${tables.bookCode2osis[lookup]}.${unityLookup[1]}`;
    } else if (lookups.toUpperCase() === lookups) {
        if (tables.bookCode2osis.lookups) {
            lookups = `${tables.bookCode2osis[lookups]}.1`;
        }
    }

    return lookups;
}

/**
 * Converts an OSIS reference to its corresponding verse index.
 *
 * @param {string} osisRef - The OSIS reference to convert
 * @returns {number|undefined} The corresponding verse index (1 is Gen.1.1, 2 is Gen.1.2, etc.), or undefined if not found 
 */
function convertOsisRefToIndex(osisRef) {                    
    return indexConversions.osisRef[osisRef];
}

/**
 * Converts a verse index to its corresponding OSIS reference.
 *
 * @param {number} index - The index to convert (1 is Gen.1.1, 2 is Gen.1.2, etc.)
 * @returns {string|undefined} The corresponding OSIS reference, or undefined if not found
 */
function convertIndexToOsisRef(index) {
    return Object.keys(indexConversions.osisRef)[index];
}

/**
 * Converts an OSIS name to a list of chapters.
 *
 * @param {string} osisBook - The OSIS book to convert
 * @returns {number[]} The list of chapter numbers
 */
function convertOsisBook2OsisChapters(osisBook) {
    return tables.osisName2osisChapters[osisBook];
}

/**
 * Converts an OSIS reference to its corresponding OSIS book.
 *
 * @param {string} osisRef - The OSIS reference to convert
 * @returns {string} The corresponding OSIS name
 */
function convertOsisRefToOsisBook(osisRef) {
    return osisRef.split('.')[0];
}

/**
 * Converts an OSIS reference to its corresponding book name.
 *
 * @param {string} osisRef - The OSIS reference to convert (e.g., "Gen.1.1", "Matt.5.6")       
 * @returns {string} The corresponding book name (e.g., "Genesis", "Matthew", etc.)
 */
function convertOsisRefToBookName(osisRef) {
    const osisName = convertOsisRefToOsisBook(osisRef);
    return tables.osis2bookName[osisName];
}

/**
 * Converts an OSIS reference to its corresponding book code.
 *
 * @param {string} osisRef - The OSIS reference to convert
 * @returns {string} The corresponding book code (e.g., "GEN", "MAT", etc.)
 */
function convertOsisRefToBookCode(osisRef) {
    const osisName = convertOsisRefToOsisBook(osisRef);
    return tables.osis2bookCode[osisName];
}

/**
 * Converts an OSIS chapter to a list of verses.
 *
 * @param {string} osisChapter - The OSIS chapter reference
 * @returns {string[]} The list of verse numbers as OSIS references
 */
function convertOsisChapterToOsisRefs(osisChapter) {
    
    osisChapter = osisChapter.replace('Psa', "Ps").replace('Pss', 'Ps');

    const chapterIndex = indexConversions.osisChapter[osisChapter];
    const versesFound = chapterIndexTable.versePerChapter[osisChapter];

    if (!versesFound) {
        console.error(`Unrecognised chapter: ${osisChapter} ${chapterIndex}`);
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
 * Converts an OSIS chapter to a list of verses.
 *
 * @param {string} osisChapter - The OSIS chapter reference
 * @returns {string} The OsisRef for the last verse in the chapter
 */
function convertOsisChapterToLastVerseInChapterOsisRef(osisChapter) {
    
    osisChapter = osisChapter.replace('Psa', "Ps").replace('Pss', 'Ps');
    
    const chapterIndex = theographicIndex.osisChapter[osisChapter];
    const versesFound = theographicChapters[chapterIndex]?.fields.verses;

    if (!versesFound) {
        console.error(`Unrecognised chapter: ${osisChapter}`);
        return [];
    }

    return (osisChapter + "." + versesFound.length);
}

/**
 * Expands an OSIS reference to include verse ranges.
 *
 * @param {string} osisRef - The OSIS reference to expand (e.g., "Gen.1.1-3")
 * @returns {string} The expanded OSIS reference with verse ranges (e.g., "Gen.1.1-Gen.1.3")
 */
function expandOsisRef(osisRef) {
    const parts = osisRef.split('.');

    // check if osis book is valid
    const book = parts[0];

    if (!tables.osis2bookCode[book]) return null;

    if (parts.length === 5)
    {
        const [book, startChapter, verseRange, endChapter, endVerse] = parts;
        let [startVerse, endBook] = verseRange.split('-');

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
        return [];
    }

    // Expand the OSIS reference range to handle cases like "Gen.1.1-3"
    const expandedRange = expandOsisRef(osisRefRange);

    if (!expandedRange || expandedRange.length === 0) {
        return [];
    }

    var refs = expandedRange.split('-');

    if (refs.length == 1)
        return [osisRefRange];

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

export {
    convertUnityLookupToOsisChapter,
    convertOsisRefToBookCode,
    convertOsisRefToIndex,
    convertIndexToOsisRef,
    convertOsisBook2OsisChapters,
    convertOsisRefToOsisBook,
    convertOsisRefToBookName,
    convertOsisChapterToOsisRefs,
    convertOsisRangeToOsisRefs,
    convertOsisChapterToLastVerseInChapterOsisRef,
    expandOsisRef
};