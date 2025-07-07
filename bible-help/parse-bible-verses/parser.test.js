import { parseBibleVerses, expandOsisRef, convertOsisRangeToOsisRefs } from "./parser.js";

describe("parser.js", () => {
    describe("parseBibleVerses", () => {
        test("should return array of OSIS references for valid input", () => {
            const result = parseBibleVerses(["Gen.1.1-3"]);
            expect(result).toStrictEqual([
                "Gen.1.1",
                "Gen.1.2", 
                "Gen.1.3"
            ]);
        });

        test("should handle single verse reference", () => {
            const result = parseBibleVerses(["Gen.1.1"]);
            expect(result).toStrictEqual(["Gen.1.1"]);
        });

        test("should handle multiple verse ranges", () => {
            const result = parseBibleVerses(["Gen.1.1-2", "Gen.1.4"]);
            expect(result).toStrictEqual([
                "Gen.1.1",
                "Gen.1.2",
                "Gen.1.4",
            ]);
        });

        test("should handle multiple verse ranges of different formats", () => {
            const result = parseBibleVerses(["Gen.1.1-2", "Matthew 1:1", "Heb.1.1-Heb.1.2"]);
            expect(result).toStrictEqual([
                "Gen.1.1",
                "Gen.1.2",
                "Matt.1.1",
                "Heb.1.1",
                "Heb.1.2"
            ]);
        });

        test("should return null for invalid input", () => {
            const result = parseBibleVerses(null);
            expect(result).toBeNull();
        });

        test("should handle string input", () => {
            const result = parseBibleVerses("Gen.1.1");
            expect(result).toStrictEqual(["Gen.1.1"]);
        });

        test("should handle JSON string input", () => {
            const result = parseBibleVerses('["Gen.1.1", "Gen.1.2"]');
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
});