export declare function expandBibleVerses(listOsisRanges: string[] | string, language?: string): string[] | null;
export declare function convertOsisChapterToOsisRefs(osisChapter: string): string[];
export declare function convertOsisRangeToOsisRefs(osisRefRange: string): string[];
export declare function expandOsisRef(osisRef: string): string | null;

/**
 * Result object returned by parseTextForBibleVerses
 */
export interface ParseTextResult {
    /** The processed text with Bible references replaced with OSIS format */
    text: string;
    /** Array of OSIS reference ranges found, sorted naturally */
    references: string[];
}

/**
 * Parses text for Bible verse references and replaces them with OSIS formatted references.
 * Uses custom recognition first for broader book name support, then bcv parser as fallback.
 * 
 * @param text - The text to parse for Bible verse references
 * @returns Object containing processed text and array of OSIS references found
 */
export declare function parseTextForBibleVerses(text: string): ParseTextResult;

/**
 * Checks if a book name is recognised in any format (OSIS, full name, abbreviation, or override).
 * This is more permissive than isValidOsisBook and can handle various book name formats.
 * 
 * @param bookName - The book name to check
 * @returns True if the book name is recognised, false otherwise
 */
export declare function isRecognisedBook(bookName: string): boolean;