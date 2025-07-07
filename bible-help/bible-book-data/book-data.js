import bibleTables from './data/bible_tables.json' with { type: "json" };
import overrides from './data/overrides.json' with { type: "json" };

export function bookNameToOsisBook(bookName) {
    if (!bookName) {
        return null;
    }

    // Convert to title case and remove any unnecessary parts
    let trimmedName = bookName.trim();
    trimmedName = trimmedName.split(':')[0].split('.')[0].replace(/\s+\d+.*$/, '').trim();

    // Check if the trimmed name is already a valid OSIS code
    if (bibleTables.osis2bookName[trimmedName]) {
        return trimmedName;
    }

    // Check if the book name is a capitalized 3 digit book code
    if (bibleTables.bookCode2osis[trimmedName]) {
        return bibleTables.bookCode2osis[trimmedName];
    }

    const words = trimmedName.toLowerCase().split(/\s+/);
    trimmedName = words.map((word, index) => {
        const lowerCaseWords = ['of', 'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with'];
        return (index === 0 || !lowerCaseWords.includes(word)) ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    }).join(' ');

    if (overrides.overrides[trimmedName.toLowerCase()]) {
        // If the book name is a known mispelling, use the corrected version
        return overrides.overrides[trimmedName.toLowerCase()];
    }

    // Check if the book name is a full book name
    if (bibleTables.bookName2osis[trimmedName]) {
        return bibleTables.bookName2osis[trimmedName];
    }
    
    return null;
}

export function osisBookToBookName(osis) {
    if (!osis) {
        return null;
    }
    
    let trimmedOsis = osis.trim();
    trimmedOsis = trimmedOsis.split(':')[0].split('.')[0].trim();

    return bibleTables.osis2bookName[trimmedOsis] || null;
}

export function isValidOsisBook(osis) {
    if (!osis) {
        return false;
    }
    
    return bibleTables.osisNames.includes(osis.trim());
}

export function getAllOsisBooks() {
    return [...bibleTables.osisNames];
}

export function getAllBookNames() {
    return Object.keys(bibleTables.bookName2osis);
}

export function replaceBookNamesWithOsis(text) {
    if (!text) {
        return text;
    }
    
    let result = text;
    const bookNames = getAllBookNames();
    const bookCodes = Object.keys(bibleTables.bookCode2osis);
    const overrideKeys = Object.keys(overrides.overrides);
    const allPossibleNames = [...bookNames, ...bookCodes, ...overrideKeys];
    
    // Sort by length (longest first) to avoid partial matches
    allPossibleNames.sort((a, b) => b.length - a.length);
    
    for (const bookName of allPossibleNames) {
        const osisBook = bookNameToOsisBook(bookName);
        if (osisBook) {
            // Create regex to match the book name as a whole word
            const regex = new RegExp(`\\b${bookName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            result = result.replace(regex, osisBook);
        }
    }
    
    return result;
}