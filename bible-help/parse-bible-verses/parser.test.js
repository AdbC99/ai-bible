import { expandBibleVerses, expandOsisRef, convertOsisRangeToOsisRefs, parseTextForBibleVerses, isRecognisedBook } from "./parser.js";

describe("parser.js", () => {
    describe("expandBibleVerses", () => {
        test("should return array of OSIS references for valid input", () => {
            const result = expandBibleVerses(["Gen.1.1-3"]);
            expect(result).toStrictEqual([
                "Gen.1.1",
                "Gen.1.2", 
                "Gen.1.3"
            ]);
        });

        test("should handle single verse reference", () => {
            const result = expandBibleVerses(["Gen.1.1"]);
            expect(result).toStrictEqual(["Gen.1.1"]);
        });

        test("should handle multiple verse ranges", () => {
            const result = expandBibleVerses(["Gen.1.1-2", "Gen.1.4"]);
            expect(result).toStrictEqual([
                "Gen.1.1",
                "Gen.1.2",
                "Gen.1.4",
            ]);
        });

        test("should handle multiple verse ranges of different formats", () => {
            const result = expandBibleVerses(["Gen.1.1-2", "Matthew 1:1", "Heb.1.1-Heb.1.2"]);
            expect(result).toStrictEqual([
                "Gen.1.1",
                "Gen.1.2",
                "Matt.1.1",
                "Heb.1.1",
                "Heb.1.2"
            ]);
        });

        test("should return null for invalid input", () => {
            const result = expandBibleVerses(null);
            expect(result).toBeNull();
        });

        test("should handle string input", () => {
            const result = expandBibleVerses("Gen.1.1");
            expect(result).toStrictEqual(["Gen.1.1"]);
        });

        test("should handle JSON string input", () => {
            const result = expandBibleVerses('["Gen.1.1", "Gen.1.2"]');
            expect(result).toStrictEqual(["Gen.1.1", "Gen.1.2"]);
        });
    });

    describe("expandOsisRef", () => {
        test("should expand osisRef", () => {
            const result = expandOsisRef("John.3.16-18");
            expect(result).toBe("John.3.16-John.3.18");
        });

        test("should keep osisRef expanded", () => {
            const result = expandOsisRef("John.3.16-John.3.18");
            expect(result).toBe("John.3.16-John.3.18");
        });

        test("should expand single book name to full book range", () => {
            const result = expandOsisRef("Gen");
            expect(result).toBe("Gen.1.1-Gen.50.26");
        });

        test("should expand single book name for shorter book", () => {
            const result = expandOsisRef("Jude");
            expect(result).toBe("Jude.1.1-Jude.1.25");
        });

        test("should expand single book name for multi-chapter book", () => {
            const result = expandOsisRef("Matt");
            expect(result).toBe("Matt.1.1-Matt.28.20");
        });

        test("should return null for invalid book name", () => {
            const result = expandOsisRef("InvalidBook");
            expect(result).toBeNull();
        });

        test("should return null for empty string", () => {
            const result = expandOsisRef("");
            expect(result).toBeNull();
        });
    });

    describe("convertOsisRangeToOsisRefs", () => {
        test("should return a range for a book", () => {
            const result = convertOsisRangeToOsisRefs("1John");
            expect(result[result.length - 1]).toEqual("1John.5.21");
        });

        test("should return a single verse for a single reference", () => {
            const result = convertOsisRangeToOsisRefs("John.3.16");
            expect(result).toEqual(["John.3.16"]);
        });

        test("should handle standard references", () => {
            const result = convertOsisRangeToOsisRefs("Matt 3:16");
            expect(result).toEqual(["Matt.3.16"]);
        });

        test("should handle long book names", () => {
            const result = convertOsisRangeToOsisRefs("Matthew 3:16-17");
            expect(result).toEqual(["Matt.3.16", "Matt.3.17"]);
        });

        test("should handle escape characters", () => {
            const result = convertOsisRangeToOsisRefs("\\Matthew 3:16-17\\");
            expect(result).toEqual(["Matt.3.16", "Matt.3.17"]);
        });

        test("should return a range of verses within the same chapter", () => {
            const result = convertOsisRangeToOsisRefs("John.3.16-18");
            expect(result).toEqual(["John.3.16", "John.3.17", "John.3.18"]);
        });

        test("should return verses spanning multiple chapters within the same book", () => {
            const result = convertOsisRangeToOsisRefs("Ps.1-Ps.2");
            expect(result).toEqual([
                "Ps.1.1",
                "Ps.1.2",
                "Ps.1.3",
                "Ps.1.4",
                "Ps.1.5",
                "Ps.1.6",
                "Ps.2.1",
                "Ps.2.2",
                "Ps.2.3",
                "Ps.2.4",
                "Ps.2.5",
                "Ps.2.6",
                "Ps.2.7",
                "Ps.2.8",
                "Ps.2.9",
                "Ps.2.10",
                "Ps.2.11",
                "Ps.2.12",
            ]);
        });

        test("should return verses from multiple chapters within the same book with verse range", () => {
            const result = convertOsisRangeToOsisRefs("John.3.16-4.2");
            expect(result).toEqual([
                "John.3.16",
                "John.3.17",
                "John.3.18",
                "John.3.19",
                "John.3.20",
                "John.3.21",
                "John.3.22",
                "John.3.23",
                "John.3.24",
                "John.3.25",
                "John.3.26",
                "John.3.27",
                "John.3.28",
                "John.3.29",
                "John.3.30",
                "John.3.31",
                "John.3.32",
                "John.3.33",
                "John.3.34",
                "John.3.35",
                "John.3.36",
                "John.4.1",
                "John.4.2",
            ]);
        });

        test("should return nothing the starting verse if books differ", () => {
            const result = convertOsisRangeToOsisRefs("John.3.16-Acts.1.1");
            expect(result).toEqual([]);
        });

        test("should handle invalid input gracefully", () => {
            const result = convertOsisRangeToOsisRefs("Invalid.1.1-2.2");
            expect(result).toEqual([]);
        });

        test("should handle single chapter range correctly", () => {
            const result = convertOsisRangeToOsisRefs("John.3-3.5");
            expect(result).toEqual([
                "John.3.1",
                "John.3.2",
                "John.3.3",
                "John.3.4",
                "John.3.5",
            ]);
        });

        test("should handle empty input gracefully", () => {
            const result = convertOsisRangeToOsisRefs("");
            expect(result).toEqual([]);
        });

        test("should handle null input gracefully", () => {
            const result = convertOsisRangeToOsisRefs(null);
            expect(result).toEqual([]);
        });

        test("should handle non osis formatted book names correctly", () => {
            const result = convertOsisRangeToOsisRefs("Genesis.3-3.2");
            expect(result).toEqual([
                "Gen.3.1",
                "Gen.3.2",
            ]);
            expect(convertOsisRangeToOsisRefs("Pss.3-3.1")).toEqual(["Ps.3.1"]);
            expect(convertOsisRangeToOsisRefs("psalms.3-3.1")).toEqual(["Ps.3.1"]);
            expect(convertOsisRangeToOsisRefs("genessis.3-3.1")).toEqual(["Gen.3.1"]);
        });
    });

    describe("parseTextForBibleVerses", () => {
        test("should replace Bible verse references with OSIS format and return references", () => {
            const text = "Read John 3:16 for hope.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("Read John.3.16 for hope.");
            expect(result.references).toEqual(["John.3.16"]);
        });

        test("should handle multiple Bible references", () => {
            const text = "Compare John 3:16 with Matt 5:3-4.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("Compare John.3.16 with Matt.5.3-Matt.5.4.");
            expect(result.references).toEqual(["John.3.16", "Matt.5.3-Matt.5.4"]);
        });

        test("should handle book name only when standalone", () => {
            const text = "Genesis has 50 chapters.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("Gen.1.1-Gen.50.26 has 50 chapters.");
            expect(result.references).toEqual(["Gen.1.1-Gen.50.26"]);
        });

        test("should handle chapter references", () => {
            const text = "Matthew 5 contains the Beatitudes.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("Matt.5.1-Matt.5.48 contains the Beatitudes.");
            expect(result.references).toEqual(["Matt.5.1-Matt.5.48"]);
        });

        test("should handle dot notation", () => {
            const text = "See Gen.1.1 for the beginning.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("See Gen.1.1 for the beginning.");
            expect(result.references).toEqual(["Gen.1.1"]);
        });

        test("should handle numbered books", () => {
            const text = "1 John 2:1 speaks of advocacy.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("1John.2.1 speaks of advocacy.");
            expect(result.references).toEqual(["1John.2.1"]);
        });

        test("should return original text if no Bible references found", () => {
            const text = "This document contains no Bible references.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("This document contains no Bible references.");
            expect(result.references).toEqual([]);
        });

        test("should handle invalid input gracefully", () => {
            expect(parseTextForBibleVerses(null)).toEqual({ text: null, references: [] });
            expect(parseTextForBibleVerses(undefined)).toEqual({ text: undefined, references: [] });
            expect(parseTextForBibleVerses("")).toEqual({ text: "", references: [] });
        });

        test("should preserve non-Bible references", () => {
            const text = "Chapter 3 of my book mentions John 3:16.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("Chapter 3 of my book mentions John.3.16.");
            expect(result.references).toEqual(["John.3.16"]);
        });

        test("should handle book name variations that bcv might miss", () => {
            const text = "Read Psalms for comfort.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("Read Ps.1.1-Ps.150.6 for comfort.");
            expect(result.references).toEqual(["Ps.1.1-Ps.150.6"]);
        });

        test("should handle book name variations with context", () => {
            const text = "Read from Psalms 23 for comfort.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("Read from Ps.23.1-Ps.23.6 for comfort.");
            expect(result.references).toEqual(["Ps.23.1-Ps.23.6"]);
        });

        test("should work with both bcv and custom patterns", () => {
            const text = "Compare John 3:16 with Psalms for comfort.";
            const result = parseTextForBibleVerses(text);
            expect(result.text).toBe("Compare John.3.16 with Ps.1.1-Ps.150.6 for comfort.");
            expect(result.references).toEqual(["John.3.16", "Ps.1.1-Ps.150.6"]);
        });
    });

    describe("isRecognisedBook", () => {
        test("should recognise valid OSIS book codes", () => {
            expect(isRecognisedBook("Gen")).toBe(true);
            expect(isRecognisedBook("John")).toBe(true);
            expect(isRecognisedBook("1John")).toBe(true);
            expect(isRecognisedBook("Rev")).toBe(true);
        });

        test("should recognise full book names", () => {
            expect(isRecognisedBook("Genesis")).toBe(true);
            expect(isRecognisedBook("Matthew")).toBe(true);
            expect(isRecognisedBook("Revelation")).toBe(true);
            expect(isRecognisedBook("1 John")).toBe(true);
        });

        test("should recognise common abbreviations", () => {
            expect(isRecognisedBook("Matt")).toBe(true);
            expect(isRecognisedBook("Rom")).toBe(true);
            expect(isRecognisedBook("Ps")).toBe(true);
        });

        test("should recognise book name overrides/misspellings", () => {
            expect(isRecognisedBook("Psalms")).toBe(true);
            expect(isRecognisedBook("Pss")).toBe(true);
        });

        test("should handle case variations", () => {
            expect(isRecognisedBook("genesis")).toBe(true);
            expect(isRecognisedBook("JOHN")).toBe(true);
            expect(isRecognisedBook("MaTtHeW")).toBe(true);
        });

        test("should return false for invalid book names", () => {
            expect(isRecognisedBook("InvalidBook")).toBe(false);
            expect(isRecognisedBook("NotABook")).toBe(false);
            expect(isRecognisedBook("")).toBe(false);
            expect(isRecognisedBook("123")).toBe(false);
        });

        test("should handle invalid input gracefully", () => {
            expect(isRecognisedBook(null)).toBe(false);
            expect(isRecognisedBook(undefined)).toBe(false);
            expect(isRecognisedBook(123)).toBe(false);
            expect(isRecognisedBook({})).toBe(false);
        });

        test("should work with book names that have extra formatting", () => {
            expect(isRecognisedBook("John 3:16")).toBe(true); // Should extract "John"
            expect(isRecognisedBook("Genesis.1.1")).toBe(true); // Should extract "Genesis"
        });
    });
});