import * as converter from "./converters.js";

describe("converters.js", () => {
    describe("expandOsisRef", () => {
        test("should expand osisRef", () => {
            const result = converter.expandOsisRef("John.3.16-18");
            expect(result).toBe("John.3.16-John.3.18");
        });

        test("should keep osisRef expanded", () => {
            const result = converter.expandOsisRef("John.3.16-John.3.18");
            expect(result).toBe("John.3.16-John.3.18");
        });
    });

    describe("convertUnityLookupToOsisChapter", () => {
        test("should convert book code with chapter:verse to OSIS format", () => {
            const result = converter.convertUnityLookupToOsisChapter("MAT:5");
            expect(result).toBe("Matt.5");
        });

        test("should convert book code with chapter to OSIS format", () => {
            const result = converter.convertUnityLookupToOsisChapter("GEN:1");
            expect(result).toBe("Gen.1");
        });

        test("should handle uppercase book codes", () => {
            const result = converter.convertUnityLookupToOsisChapter("ROM:8");
            expect(result).toBe("Rom.8");
        });

        test("should handle input without colon", () => {
            const result =
                converter.convertUnityLookupToOsisChapter("Matt.5.6");
            expect(result).toBe("Matt.5.6");
        });

        test("should handle empty string", () => {
            const result = converter.convertUnityLookupToOsisChapter("");
            expect(result).toBe("");
        });

        test("should handle single book code lookup", () => {
            // This tests the uppercase condition branch
            const result = converter.convertUnityLookupToOsisChapter("GEN");
            // Based on the code logic, this would check tables.bookCode2osis.lookups
            // which doesn't exist in our mock, so it should return the original
            expect(result).toBe("GEN");
        });
    });

    describe("convertOsisRefToIndex", () => {
        test("should convert valid OSIS reference to index", () => {
            const result = converter.convertOsisRefToIndex("Matt.5.6");
            expect(result).toBe(23240);
        });

        test("should convert Genesis reference to index", () => {
            const result = converter.convertOsisRefToIndex("Gen.1.1");
            expect(result).toBe(0);
        });

        test("should return undefined for invalid reference", () => {
            const result = converter.convertOsisRefToIndex("Invalid.1.1");
            expect(result).toBeUndefined();
        });

        test("should handle null input", () => {
            const result = converter.convertOsisRefToIndex(null);
            expect(result).toBeUndefined();
        });

        test("should handle undefined input", () => {
            const result = converter.convertOsisRefToIndex(undefined);
            expect(result).toBeUndefined();
        });
    });

    describe("convertIndexToOsisRef", () => {
        test("should convert index 0 to first OSIS reference", () => {
            const result = converter.convertIndexToOsisRef(0);
            expect(result).toBe("Gen.1.1");
        });

        test("should convert index 1 to second OSIS reference", () => {
            const result = converter.convertIndexToOsisRef(1);
            expect(result).toBe("Gen.1.2");
        });

        test("should handle out of bounds index", () => {
            const result = converter.convertIndexToOsisRef(999999);
            expect(result).toBeUndefined();
        });

        test("should handle negative index", () => {
            const result = converter.convertIndexToOsisRef(-1);
            expect(result).toBeUndefined();
        });

        test("should handle null index", () => {
            const result = converter.convertIndexToOsisRef(null);
            expect(result).toBeUndefined();
        });
    });

    describe("convertOsisBook2OsisChapters", () => {
        test("should return chapters for Genesis", () => {
            const result = converter.convertOsisBook2OsisChapters("Gen");
            expect(result).toEqual([
                "Gen.1",
                "Gen.2",
                "Gen.3",
                "Gen.4",
                "Gen.5",
                "Gen.6",
                "Gen.7",
                "Gen.8",
                "Gen.9",
                "Gen.10",
                "Gen.11",
                "Gen.12",
                "Gen.13",
                "Gen.14",
                "Gen.15",
                "Gen.16",
                "Gen.17",
                "Gen.18",
                "Gen.19",
                "Gen.20",
                "Gen.21",
                "Gen.22",
                "Gen.23",
                "Gen.24",
                "Gen.25",
                "Gen.26",
                "Gen.27",
                "Gen.28",
                "Gen.29",
                "Gen.30",
                "Gen.31",
                "Gen.32",
                "Gen.33",
                "Gen.34",
                "Gen.35",
                "Gen.36",
                "Gen.37",
                "Gen.38",
                "Gen.39",
                "Gen.40",
                "Gen.41",
                "Gen.42",
                "Gen.43",
                "Gen.44",
                "Gen.45",
                "Gen.46",
                "Gen.47",
                "Gen.48",
                "Gen.49",
                "Gen.50",
            ]);
        });

        test("should return chapters for Matthew", () => {
            const result = converter.convertOsisBook2OsisChapters("Matt");
            expect(result).toEqual([
                "Matt.1",
                "Matt.2",
                "Matt.3",
                "Matt.4",
                "Matt.5",
                "Matt.6",
                "Matt.7",
                "Matt.8",
                "Matt.9",
                "Matt.10",
                "Matt.11",
                "Matt.12",
                "Matt.13",
                "Matt.14",
                "Matt.15",
                "Matt.16",
                "Matt.17",
                "Matt.18",
                "Matt.19",
                "Matt.20",
                "Matt.21",
                "Matt.22",
                "Matt.23",
                "Matt.24",
                "Matt.25",
                "Matt.26",
                "Matt.27",
                "Matt.28",
            ]);
        });

        test("should return undefined for invalid book name", () => {
            const result =
                converter.convertOsisBook2OsisChapters("InvalidBook");
            expect(result).toBeUndefined();
        });

        test("should handle null input", () => {
            const result = converter.convertOsisBook2OsisChapters(null);
            expect(result).toBeUndefined();
        });

        test("should handle empty string", () => {
            const result = converter.convertOsisBook2OsisChapters("");
            expect(result).toBeUndefined();
        });
    });

    describe("convertOsisRefToOsisBook", () => {
        test("should extract book name from full reference", () => {
            const result = converter.convertOsisRefToOsisBook("Matt.5.6");
            expect(result).toBe("Matt");
        });

        test("should extract book name from chapter reference", () => {
            const result = converter.convertOsisRefToOsisBook("Gen.1");
            expect(result).toBe("Gen");
        });

        test("should handle single book name", () => {
            const result = converter.convertOsisRefToOsisBook("Rom");
            expect(result).toBe("Rom");
        });

        test("should handle complex reference", () => {
            const result = converter.convertOsisRefToOsisBook("John.3.16");
            expect(result).toBe("John");
        });

        test("should handle empty string", () => {
            const result = converter.convertOsisRefToOsisBook("");
            expect(result).toBe("");
        });

        test("should handle null input", () => {
            expect(() => converter.convertOsisRefToOsisBook(null)).toThrow();
        });
    });

    describe("convertOsisRefToBookName", () => {
        test("should convert OSIS reference to full book name", () => {
            const result = converter.convertOsisRefToBookName("Matt.5.6");
            expect(result).toBe("Matthew");
        });

        test("should convert Genesis reference to full book name", () => {
            const result = converter.convertOsisRefToBookName("Gen.1.1");
            expect(result).toBe("Genesis");
        });

        test("should convert John reference to full book name", () => {
            const result = converter.convertOsisRefToBookName("John.3.16");
            expect(result).toBe("John");
        });

        test("should return undefined for invalid book", () => {
            const result = converter.convertOsisRefToBookName("Invalid.1.1");
            expect(result).toBeUndefined();
        });

        test("should handle chapter-only reference", () => {
            const result = converter.convertOsisRefToBookName("Rom.8");
            expect(result).toBe("Romans");
        });
    });

    describe("convertOsisRefToBookCode", () => {
        test("should convert OSIS reference to book code", () => {
            const result = converter.convertOsisRefToBookCode("Matt.5.6");
            expect(result).toBe("MAT");
        });

        test("should convert Genesis reference to book code", () => {
            const result = converter.convertOsisRefToBookCode("Gen.1.1");
            expect(result).toBe("GEN");
        });

        test("should convert Romans reference to book code", () => {
            const result = converter.convertOsisRefToBookCode("Rom.8.28");
            expect(result).toBe("ROM");
        });

        test("should return undefined for invalid book", () => {
            const result = converter.convertOsisRefToBookCode("Invalid.1.1");
            expect(result).toBeUndefined();
        });

        test("should handle book-only reference", () => {
            const result = converter.convertOsisRefToBookCode("Mark");
            expect(result).toBe("MAR");
        });
    });
});

// Error handling and edge cases
describe("Error Handling", () => {
    test("should handle malformed OSIS references gracefully", () => {
        expect(() =>
            converter.convertOsisRefToBookName("Matt..5")
        ).not.toThrow();
        expect(() => converter.convertOsisRefToBookCode("")).not.toThrow();
        expect(() => converter.convertOsisRefToIndex("...")).not.toThrow();
    });

    test("should handle special characters in input", () => {
        const result = converter.convertUnityLookupToOsisChapter("MAT:5@#$");
        expect(result).toBe("Matt.5@#$");
    });

    test("should handle numeric inputs where strings expected", () => {
        expect(() => converter.convertOsisRefToOsisBook(123)).toThrow();
        expect(() => converter.convertUnityLookupToOsisChapter(456)).toThrow();
    });

    test("should return appropriate defaults for missing data", () => {
        const index = converter.convertOsisRefToIndex("NonExistent.1.1");
        expect(index).toBeUndefined();
    });
});

describe("convertOsisRangeToOsisRefs", () => {
    test("should return a range for a book", () => {
        const result = converter.convertOsisRangeToOsisRefs("1John");
        expect(result[result.length - 1]).toEqual("1John.5.21");
    });

    test("should return a single verse for a single reference", () => {
        const result = converter.convertOsisRangeToOsisRefs("John.3.16");
        expect(result).toEqual(["John.3.16"]);
    });

    test("should handle standard references", () => {
        const result = converter.convertOsisRangeToOsisRefs("Matt 3:16");
        expect(result).toEqual(["Matt.3.16"]);
    });

    test("should handle long book names", () => {
        const result = converter.convertOsisRangeToOsisRefs("Matthew 3:16-17");
        expect(result).toEqual(["Matt.3.16", "Matt.3.17"]);
    });

    test("should return a range of verses within the same chapter", () => {
        const result = converter.convertOsisRangeToOsisRefs("John.3.16-18");
        expect(result).toEqual(["John.3.16", "John.3.17", "John.3.18"]);
    });

    test("should return verses spanning multiple chapters within the same book", () => {
        // pslams doesn't need this, but other books do.
        const result = converter.convertOsisRangeToOsisRefs("Ps.1-Ps.2");
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
        const result = converter.convertOsisRangeToOsisRefs("John.3.16-4.2");
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
        const result =
            converter.convertOsisRangeToOsisRefs("John.3.16-Acts.1.1");
        expect(result).toEqual([]);
    });

    test("should handle invalid input gracefully", () => {
        const result = converter.convertOsisRangeToOsisRefs("Invalid.1.1-2.2");
        expect(result).toEqual([]);
    });

    test("should handle single chapter range correctly", () => {
        const result = converter.convertOsisRangeToOsisRefs("John.3-3.5");
        expect(result).toEqual([
            "John.3.1",
            "John.3.2",
            "John.3.3",
            "John.3.4",
            "John.3.5",
        ]);
    });

    test("should handle empty input gracefully", () => {
        const result = converter.convertOsisRangeToOsisRefs("");
        expect(result).toEqual([]);
    });

    test("should handle null input gracefully", () => {
        const result = converter.convertOsisRangeToOsisRefs(null);
        expect(result).toEqual([]);
    });
});
