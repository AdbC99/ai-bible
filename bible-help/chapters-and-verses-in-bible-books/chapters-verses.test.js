import { getIndexFromOsisRef, getChaptersInBook, getVersesInBook, getVersesInChapter } from './chapters-verses.js';

describe('chapters-verses', () => {
    
    describe('getIndexFromOsisRef', () => {
        test('should return correct index for Genesis 1:1', () => {
            expect(getIndexFromOsisRef('Gen.1.1')).toBe(0);
        });

        test('should return correct index for Genesis 1:2', () => {
            expect(getIndexFromOsisRef('Gen.1.2')).toBe(1);
        });

        test('should return correct index for Genesis 2:1', () => {
            expect(getIndexFromOsisRef('Gen.2.1')).toBe(31);
        });

        test('should return undefined for invalid reference', () => {
            expect(getIndexFromOsisRef('InvalidRef')).toBeUndefined();
        });

        test('should return undefined for null input', () => {
            expect(getIndexFromOsisRef(null)).toBeUndefined();
        });

        test('should return undefined for non-string input', () => {
            expect(getIndexFromOsisRef(123)).toBeUndefined();
        });
    });

    describe('getChaptersInBook', () => {
        test('should return correct number of chapters for Genesis', () => {
            expect(getChaptersInBook('Genesis')).toBe(50);
        });

        test('should return correct number of chapters for Genesis with abbreviation', () => {
            expect(getChaptersInBook('Gen')).toBe(50);
        });

        test('should return correct number of chapters for Matthew', () => {
            expect(getChaptersInBook('Matthew')).toBe(28);
        });

        test('should return correct number of chapters for Matthew with abbreviation', () => {
            expect(getChaptersInBook('Matt')).toBe(28);
        });

        test('should return correct number of chapters for Psalm', () => {
            expect(getChaptersInBook('Psalm')).toBe(150);
        });

        test('should return correct number of chapters for single chapter book (Obadiah)', () => {
            expect(getChaptersInBook('Obadiah')).toBe(1);
        });

        test('should return undefined for invalid book name', () => {
            expect(getChaptersInBook('InvalidBook')).toBeUndefined();
        });

        test('should return undefined for null input', () => {
            expect(getChaptersInBook(null)).toBeUndefined();
        });

        test('should return undefined for non-string input', () => {
            expect(getChaptersInBook(123)).toBeUndefined();
        });
    });

    describe('getVersesInBook', () => {
        test('should return correct number of verses for Genesis', () => {
            expect(getVersesInBook('Genesis')).toBe(1533);
        });

        test('should return correct number of verses for Genesis with abbreviation', () => {
            expect(getVersesInBook('Gen')).toBe(1533);
        });

        test('should return correct number of verses for Matthew', () => {
            expect(getVersesInBook('Matthew')).toBe(1071);
        });

        test('should return correct number of verses for single chapter book (Obadiah)', () => {
            expect(getVersesInBook('Obadiah')).toBe(21);
        });

        test('should return undefined for invalid book name', () => {
            expect(getVersesInBook('InvalidBook')).toBeUndefined();
        });

        test('should return undefined for null input', () => {
            expect(getVersesInBook(null)).toBeUndefined();
        });

        test('should return undefined for non-string input', () => {
            expect(getVersesInBook(123)).toBeUndefined();
        });
    });

    describe('getVersesInChapter', () => {
        test('should return correct number of verses for Genesis 1', () => {
            expect(getVersesInChapter('Genesis', 1)).toBe(31);
        });

        test('should return correct number of verses for Genesis 1 with abbreviation', () => {
            expect(getVersesInChapter('Gen', 1)).toBe(31);
        });

        test('should return correct number of verses for Genesis 2', () => {
            expect(getVersesInChapter('Genesis', 2)).toBe(25);
        });

        test('should return correct number of verses for Matthew 1', () => {
            expect(getVersesInChapter('Matthew', 1)).toBe(25);
        });

        test('should return correct number of verses for Psalm 119 (longest chapter)', () => {
            expect(getVersesInChapter('Psalm', 119)).toBe(176);
        });

        test('should return correct number of verses for single chapter book (Obadiah)', () => {
            expect(getVersesInChapter('Obadiah', 1)).toBe(21);
        });

        test('should return undefined for invalid book name', () => {
            expect(getVersesInChapter('InvalidBook', 1)).toBeUndefined();
        });

        test('should return undefined for invalid chapter number', () => {
            expect(getVersesInChapter('Genesis', 999)).toBeUndefined();
        });

        test('should return undefined for null book name', () => {
            expect(getVersesInChapter(null, 1)).toBeUndefined();
        });

        test('should return undefined for null chapter number', () => {
            expect(getVersesInChapter('Genesis', null)).toBeUndefined();
        });

        test('should return undefined for non-string book name', () => {
            expect(getVersesInChapter(123, 1)).toBeUndefined();
        });

        test('should return undefined for non-number chapter', () => {
            expect(getVersesInChapter('Genesis', 'invalid')).toBeUndefined();
        });
    });
});