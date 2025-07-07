import * as converter from "./converters.js";

describe("converters.js", () => {
    describe("convertOsisRefToIndex", () => {
        test("should convert valid OSIS reference to index", () => {
            const result = converter.convertOsisRefToIndex("Matt.5.6");
            expect(result).toBe(23240);
        });

        test("should convert valid OSIS reference to index with escape chars", () => {
            const result = converter.convertOsisRefToIndex("\\Matt.5.6\\");
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
});

// Error handling and edge cases
describe("Error Handling", () => {
    test("should handle malformed OSIS references gracefully", () => {
        expect(() => converter.convertOsisRefToIndex("...")).not.toThrow();
    });


    test("should return appropriate defaults for missing data", () => {
        const index = converter.convertOsisRefToIndex("NonExistent.1.1");
        expect(index).toBeUndefined();
    });
});