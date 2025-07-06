export declare function getBibleVerse(osisRef: string, language?: string): string | null;
export declare function getBibleVerses(osisRange: string, language?: string): (string | null)[];
export declare function getListBibleVerses(listOsisRanges: string[] | string, language?: string): (string | null)[];
export declare function getOriginalTextVerses(osisRange: string): (string | null)[];
export declare function getOriginalTextVerse(osisRef: string): string | null;
export declare function getTransliteratedVerse(osisRef: string): string | null;
export declare function getTransliteratedVerses(osisRange: string): (string | null)[];

export declare function convertUnityLookupToOsisChapter(unityLookups: string): string;
export declare function convertOsisRefToBookCode(osisRef: string): string;
export declare function convertOsisRefToIndex(osisRef: string): number | undefined;
export declare function convertIndexToOsisRef(index: number): string | undefined;
export declare function convertOsisBook2OsisChapters(osisBook: string): number[];
export declare function convertOsisRefToOsisBook(osisRef: string): string;
export declare function convertOsisRefToBookName(osisRef: string): string;
export declare function convertOsisChapterToOsisRefs(osisChapter: string): string[];
export declare function convertOsisRangeToOsisRefs(osisRefRange: string): string[];
export declare function convertOsisChapterToLastVerseInChapterOsisRef(osisChapter: string): string;
export declare function expandOsisRef(osisRef: string): string | null;