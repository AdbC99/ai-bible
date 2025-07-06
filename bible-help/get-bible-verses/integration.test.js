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

    test("should convert unity lookup and get verse", () => {
        const unityLookup = "MAT:5";
        const osisChapter =
            converter.convertUnityLookupToOsisChapter(unityLookup);
        expect(osisChapter).toBe("Matt.5");

        // This would need the full verse reference, but demonstrates the workflow
        const bookName = converter.convertOsisRefToBookName("Matt.5.6");
        expect(bookName).toBe("Matthew");
    });

    test("should handle round-trip conversion", () => {
        const originalRef = "John.3.16";
        const index = converter.convertOsisRefToIndex(originalRef);
        const convertedBack = converter.convertIndexToOsisRef(index);

        expect(convertedBack).toBe(originalRef);
    });

    test("should get book information from reference", () => {
        const ref = "Rom.8.28";
        const bookName = converter.convertOsisRefToBookName(ref);
        const bookCode = converter.convertOsisRefToBookCode(ref);
        const osisName = converter.convertOsisRefToOsisBook(ref);

        expect(bookName).toBe("Romans");
        expect(bookCode).toBe("ROM");
        expect(osisName).toBe("Rom");
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
            converter.convertOsisRefToBookName(ref);
        });

        const end = Date.now();
        expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });

    test("should handle array of conversions efficiently", () => {
        const lookups = ["MAT:1", "GEN:2", "JOH:3", "ROM:8"];
        const results = lookups.map((lookup) =>
            converter.convertUnityLookupToOsisChapter(lookup)
        );

        expect(results).toEqual(["Matt.1", "Gen.2", "John.3", "Rom.8"]);
    });
});
