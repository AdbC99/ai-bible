import { getBibleVerse } from "./berean.js";
import * as converter from "./converters.js";

// Integration tests
describe("Integration Tests: Converters & Berean", () => {
    test("should get verse using converted reference", () => {
        const osisRef = "Matt.5.6";
        const index = converter.convertOsisRefToIndex(osisRef);
        expect(index).toBe(23240);

        const verse = getBibleVerse(osisRef);
        expect(verse).toBe(
            "Blessed are those who hunger and thirst for righteousness, for they will be filled."
        );
    });

    test("should handle round-trip conversion", () => {
        const originalRef = "John.3.16";
        const index = converter.convertOsisRefToIndex(originalRef);
        expect(index).toBe(26136);
    });
});

// Performance tests (basic)
describe("Performance Tests", () => {
    test("should handle multiple rapid lookups", () => {
        const references = ["Matt.5.6", "John.3.16", "Gen.1.1", "Rom.8.28"];
        const start = Date.now();

        references.forEach((ref) => {
            getBibleVerse(ref);
            converter.convertOsisRefToIndex(ref);
        });

        const end = Date.now();
        expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });
});
