import { getListBibleVerses } from "@bible-help/get-bible-verses";

console.log("Example usage of getListBibleVerses:");
const verses = getListBibleVerses(["Gen.1.1-Gen.1.3", "Gen.1.1-5"], "hebrew");
console.log(verses);
// Output should be the verses from Genesis 1:1-5 in Hebrew
// Note: Ensure that the @bible-help/get-bible-verses package is installed and