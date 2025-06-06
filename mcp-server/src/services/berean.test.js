import { getBibleVerse, getBibleVerses, getOriginalTextVerse, getTransliteratedVerse } from "./berean.js";

describe("berean.js", () => {
    describe("getOriginalTextVerse(s)", () => {
        test("should return original language verse for valid OSIS reference", () => {
            const result = getOriginalTextVerse("Gen.1.1").trim();
            expect(result).toBe(
                "בְּרֵאשִׁ֖ית אֱלֹהִ֑ים אֵ֥ת בָּרָ֣א הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃."
            );
        });
    });

    describe("getTransliteratedVerse(s)", () => {
        test("should return transliterated original language verse for valid OSIS reference", () => {
            const result = getTransliteratedVerse("Gen.1.1").trim();
            expect(result).toBe(
                "bə·rê·šîṯ ’ĕ·lō·hîm ’êṯ bā·rā haš·šā·ma·yim wə·’êṯ hā·’ā·reṣ."
            );
        });
    });

    describe("getBibleVerse(s)", () => {
        test("should return verse for valid OSIS reference", () => {
            const result = getBibleVerse("Matt.5.6");
            expect(result).toBe(
                "Blessed are those who hunger and thirst for righteousness, for they will be filled."
            );
        });

        test("should return book of Genesis", () => {
            const result = getBibleVerses("Genesis");
            expect(result.length).toBe(1533);
        });

        test("should return verse for Genesis reference", () => {
            const result = getBibleVerse("Gen.1.1");
            expect(result).toBe(
                "In the beginning God created the heavens and the earth."
            );
        });

        test("should return verses for Genesis references expanded", () => {
            const result = getBibleVerses("Gen.1.1-Gen.1.3");
            expect(result).toStrictEqual([
                "In the beginning God created the heavens and the earth.",
                "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
                "And God said, “Let there be light,” and there was light.",
            ]);
        });

        test("should return verses for Genesis references condensed", () => {
            const result = getBibleVerses("Gen.1.1-3");
            expect(result).toStrictEqual([
                "In the beginning God created the heavens and the earth.",
                "Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.",
                "And God said, “Let there be light,” and there was light.",
            ]);
        });

        test("should return verse for John reference", () => {
            const result = getBibleVerse("John.3.16");
            expect(result).toBe(
                "For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life."
            );
        });

        test("should return null for invalid OSIS reference", () => {
            const result = getBibleVerse("Invalid.1.1");
            expect(result).toBeNull();
        });

        test("should return null for undefined reference", () => {
            const result = getBibleVerse(undefined);
            expect(result).toBeNull();
        });

        test("should return null for empty string reference", () => {
            const result = getBibleVerse("");
            expect(result).toBeNull();
        });

        test("should return null for null reference", () => {
            const result = getBibleVerse(null);
            expect(result).toBeNull();
        });
    });
});
