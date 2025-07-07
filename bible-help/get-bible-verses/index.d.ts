export declare function getBibleVerse(osisRef: string, language?: string): string | null;
export declare function getBibleVerses(osisRange: string, language?: string): (string | null)[];
export declare function getListBibleVerses(listOsisRanges: string[] | string, language?: string): (string | null)[];
export declare function getOriginalTextVerses(osisRange: string): (string | null)[];
export declare function getOriginalTextVerse(osisRef: string): string | null;
export declare function getTransliteratedVerse(osisRef: string): string | null;
export declare function getTransliteratedVerses(osisRange: string): (string | null)[];