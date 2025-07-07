import {
    bookNameToOsisBook,
    osisBookToBookName,
    isValidOsisBook,
    getAllOsisBooks,
    getAllBookNames,
    replaceBookNamesWithOsis
} from './book-data.js';

describe('bookNameToOsisBook', () => {
    test('should return null for empty or null input', () => {
        expect(bookNameToOsisBook(null)).toBe(null);
        expect(bookNameToOsisBook('')).toBe(null);
        expect(bookNameToOsisBook('   ')).toBe(null);
    });

    test('should convert standard book names to OSIS format', () => {
        expect(bookNameToOsisBook('Genesis')).toBe('Gen');
        expect(bookNameToOsisBook('Exodus')).toBe('Exod');
        expect(bookNameToOsisBook('1 Samuel')).toBe('1Sam');
        expect(bookNameToOsisBook('2 Kings')).toBe('2Kgs');
        expect(bookNameToOsisBook('Revelation')).toBe('Rev');
    });

    test('should handle case-insensitive input', () => {
        expect(bookNameToOsisBook('genesis')).toBe('Gen');
        expect(bookNameToOsisBook('EXODUS')).toBe('Exod');
        expect(bookNameToOsisBook('psalms')).toBe('Ps');
    });

    test('should handle book names with extra whitespace', () => {
        expect(bookNameToOsisBook('  Genesis  ')).toBe('Gen');
        expect(bookNameToOsisBook('\tExodus\n')).toBe('Exod');
    });

    test('should handle book names with colons and periods', () => {
        expect(bookNameToOsisBook('Genesis:1')).toBe('Gen');
        expect(bookNameToOsisBook('Exodus.1')).toBe('Exod');
        expect(bookNameToOsisBook('Leviticus 1')).toBe('Lev');
    });

    test('should handle osis references', () => {
        expect(bookNameToOsisBook('Gen.1.1')).toBe('Gen');
        expect(bookNameToOsisBook('Exod.1-Exod.2')).toBe('Exod');
        expect(bookNameToOsisBook('Heb.1.1-5')).toBe('Heb');
    });

    test('should handle overrides for common misspellings', () => {
        expect(bookNameToOsisBook('Phillipians')).toBe('Phil');
        expect(bookNameToOsisBook('Philipians')).toBe('Phil');
        expect(bookNameToOsisBook('Philippians')).toBe('Phil');
        expect(bookNameToOsisBook('1Corinthians')).toBe('1Cor');
        expect(bookNameToOsisBook('2Corinthians')).toBe('2Cor');
    });

    test('should handle short forms and abbreviations', () => {
        expect(bookNameToOsisBook('Act')).toBe('Acts');
        expect(bookNameToOsisBook('Pss')).toBe('Ps');
        expect(bookNameToOsisBook('Psa')).toBe('Ps');
        expect(bookNameToOsisBook('Jam')).toBe('Jas');
    });

    test('should return null for invalid book names', () => {
        expect(bookNameToOsisBook('InvalidBook')).toBe(null);
        expect(bookNameToOsisBook('123')).toBe(null);
        expect(bookNameToOsisBook('Random Text')).toBe(null);
    });
});

describe('osisBookToBookName', () => {
    test('should return null for empty or null input', () => {
        expect(osisBookToBookName(null)).toBe(null);
        expect(osisBookToBookName('')).toBe(null);
        expect(osisBookToBookName('   ')).toBe(null);
    });

    test('should convert OSIS codes to full book names', () => {
        expect(osisBookToBookName('Gen')).toBe('Genesis');
        expect(osisBookToBookName('Exod')).toBe('Exodus');
        expect(osisBookToBookName('1Sam')).toBe('1 Samuel');
        expect(osisBookToBookName('2Kgs')).toBe('2 Kings');
        expect(osisBookToBookName('Rev')).toBe('Revelation');
    });

    test('should handle OSIS codes with extra whitespace', () => {
        expect(osisBookToBookName('  Gen  ')).toBe('Genesis');
        expect(osisBookToBookName('\tExod\n')).toBe('Exodus');
    });

    test('should return null for invalid OSIS codes', () => {
        expect(osisBookToBookName('InvalidOsis')).toBe(null);
        expect(osisBookToBookName('123')).toBe(null);
        expect(osisBookToBookName('GEN')).toBe(null);
    });
});

describe('isValidOsisBook', () => {
    test('should return false for empty or null input', () => {
        expect(isValidOsisBook(null)).toBe(false);
        expect(isValidOsisBook('')).toBe(false);
        expect(isValidOsisBook('   ')).toBe(false);
    });

    test('should return true for valid OSIS codes', () => {
        expect(isValidOsisBook('Gen')).toBe(true);
        expect(isValidOsisBook('Exod')).toBe(true);
        expect(isValidOsisBook('1Sam')).toBe(true);
        expect(isValidOsisBook('2Kgs')).toBe(true);
        expect(isValidOsisBook('Rev')).toBe(true);
    });

    test('should handle OSIS codes with extra whitespace', () => {
        expect(isValidOsisBook('  Gen  ')).toBe(true);
        expect(isValidOsisBook('\tExod\n')).toBe(true);
    });

    test('should return false for invalid OSIS codes', () => {
        expect(isValidOsisBook('InvalidOsis')).toBe(false);
        expect(isValidOsisBook('123')).toBe(false);
        expect(isValidOsisBook('GEN')).toBe(false);
        expect(isValidOsisBook('genesis')).toBe(false);
    });
});

describe('getAllOsisBooks', () => {
    test('should return an array of all OSIS book codes', () => {
        const osisBooks = getAllOsisBooks();
        expect(Array.isArray(osisBooks)).toBe(true);
        expect(osisBooks.length).toBeGreaterThan(0);
        expect(osisBooks).toContain('Gen');
        expect(osisBooks).toContain('Exod');
        expect(osisBooks).toContain('Rev');
    });

    test('should return a copy of the array (not reference)', () => {
        const osisBooks1 = getAllOsisBooks();
        const osisBooks2 = getAllOsisBooks();
        expect(osisBooks1).not.toBe(osisBooks2);
        expect(osisBooks1).toEqual(osisBooks2);
    });

    test('should contain 66 books (standard Bible)', () => {
        const osisBooks = getAllOsisBooks();
        expect(osisBooks.length).toBe(66);
    });
});

describe('getAllBookNames', () => {
    test('should return an array of all book names', () => {
        const bookNames = getAllBookNames();
        expect(Array.isArray(bookNames)).toBe(true);
        expect(bookNames.length).toBeGreaterThan(0);
        expect(bookNames).toContain('Genesis');
        expect(bookNames).toContain('Exodus');
        expect(bookNames).toContain('Revelation');
    });

    test('should return book names as keys from the mapping', () => {
        const bookNames = getAllBookNames();
        expect(bookNames).toContain('1 Samuel');
        expect(bookNames).toContain('2 Kings');
        expect(bookNames).toContain('1 Chronicles');
    });
});

describe('integration tests', () => {
    test('should maintain consistency between conversion functions', () => {
        const bookNames = getAllBookNames();
        
        bookNames.forEach(bookName => {
            const osisCode = bookNameToOsisBook(bookName);
            expect(osisCode).toBeTruthy();
            expect(isValidOsisBook(osisCode)).toBe(true);
            
            const convertedBack = osisBookToBookName(osisCode);
            expect(convertedBack).toBe(bookName);
        });
    });

    test('should handle round-trip conversion correctly', () => {
        const testCases = [
            'Genesis',
            'Exodus', 
            '1 Samuel',
            '2 Kings',
            'Psalm',
            'Revelation'
        ];

        testCases.forEach(bookName => {
            const osisCode = bookNameToOsisBook(bookName);
            const backToBookName = osisBookToBookName(osisCode);
            
            expect(backToBookName).toBe(bookName);
        });
    });
});

describe('replaceBookNamesWithOsis', () => {
    test('should return unchanged text for empty or null input', () => {
        expect(replaceBookNamesWithOsis(null)).toBe(null);
        expect(replaceBookNamesWithOsis('')).toBe('');
        expect(replaceBookNamesWithOsis('   ')).toBe('   ');
    });

    test('should replace single book names with OSIS codes', () => {
        expect(replaceBookNamesWithOsis('Genesis')).toBe('Gen');
        expect(replaceBookNamesWithOsis('Exodus')).toBe('Exod');
        expect(replaceBookNamesWithOsis('Revelation')).toBe('Rev');
    });

    test('should replace multiple book names in text', () => {
        expect(replaceBookNamesWithOsis('Read Genesis and Exodus')).toBe('Read Gen and Exod');
        expect(replaceBookNamesWithOsis('From Genesis to Revelation')).toBe('From Gen to Rev');
        expect(replaceBookNamesWithOsis('1 Samuel and 2 Kings are historical books')).toBe('1Sam and 2Kgs are historical books');
    });

    test('should handle case-insensitive replacement', () => {
        expect(replaceBookNamesWithOsis('genesis')).toBe('Gen');
        expect(replaceBookNamesWithOsis('EXODUS')).toBe('Exod');
        expect(replaceBookNamesWithOsis('psalms')).toBe('Ps');
    });

    test('should replace book names with word boundaries', () => {
        expect(replaceBookNamesWithOsis('Genesis chapter 1')).toBe('Gen chapter 1');
        expect(replaceBookNamesWithOsis('Read Genesis:1')).toBe('Read Gen:1');
        expect(replaceBookNamesWithOsis('The book of Genesis')).toBe('The book of Gen');
        expect(replaceBookNamesWithOsis('Genesis, Exodus, and Leviticus')).toBe('Gen, Exod, and Lev');
    });

    test('should not replace partial matches', () => {
        expect(replaceBookNamesWithOsis('Genesisology')).toBe('Genesisology');
        expect(replaceBookNamesWithOsis('Exoduslike')).toBe('Exoduslike');
    });

    test('should replace override spellings', () => {
        expect(replaceBookNamesWithOsis('Phillipians')).toBe('Phil');
        expect(replaceBookNamesWithOsis('Philipians')).toBe('Phil');
        expect(replaceBookNamesWithOsis('1Corinthians')).toBe('1Cor');
        expect(replaceBookNamesWithOsis('2Corinthians')).toBe('2Cor');
    });

    test('should replace book codes', () => {
        expect(replaceBookNamesWithOsis('Act')).toBe('Acts');
        expect(replaceBookNamesWithOsis('Pss')).toBe('Ps');
        expect(replaceBookNamesWithOsis('Psa')).toBe('Ps');
        expect(replaceBookNamesWithOsis('Jam')).toBe('Jas');
    });

    test('should handle complex text with multiple replacements', () => {
        const input = 'Study Genesis 1, read Exodus 20, and meditate on Psalms 23. Also check 1 Samuel 17 and 2 Kings 5.';
        const expected = 'Study Gen 1, read Exod 20, and meditate on Ps 23. Also check 1Sam 17 and 2Kgs 5.';
        expect(replaceBookNamesWithOsis(input)).toBe(expected);
    });

    test('should preserve text that is not book names', () => {
        expect(replaceBookNamesWithOsis('Hello world')).toBe('Hello world');
        expect(replaceBookNamesWithOsis('123 numerical')).toBe('123 numerical');
        expect(replaceBookNamesWithOsis('Random text with no books')).toBe('Random text with no books');
    });

    test('should handle mixed case and punctuation', () => {
        expect(replaceBookNamesWithOsis('Genesis, exodus; and REVELATION!')).toBe('Gen, Exod; and Rev!');
        expect(replaceBookNamesWithOsis('Read "Genesis" and (Exodus)')).toBe('Read "Gen" and (Exod)');
    });

    test('should prioritize longer matches over shorter ones', () => {
        expect(replaceBookNamesWithOsis('1 Samuel')).toBe('1Sam');
        expect(replaceBookNamesWithOsis('2 Chronicles')).toBe('2Chr');
    });
});