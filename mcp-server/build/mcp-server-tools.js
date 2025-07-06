import { getBibleVerses, getListBibleVerses, getOriginalTextVerses, getTransliteratedVerses, } from "../../bible-help/get-bible-verses/index.js";
import logger from "./services/logger.js";
import { z } from "zod";
/**
 * Adds a tool to get a bible verse given a reference.
 *
 * @param server - The MCP server instance.
 * @returns {McpServer} The updated server with the new tool added.
 */
const addGetBibleVerses = (server) => {
    return server.tool("get-bible-verses", "Get one or more Bible verse given a list of verse references or whole book names. ALWAYS set language to 'english' unless user explicitly requests Hebrew, Greek, original or transliteration. ALWAYS present the found results to the user. Never say 'no results found' unless the tool explicitly returns empty data. Use the returned information to answer the user's question.", {
        /**
         * A bible verse reference to search for (e.g. "John.3.16-17" or "John"). Results from this search should be presented to the user in the main response
         *
         * @type string or array<string>
         */
        verses: z
            .union([
            z.string(),
            z.array(z.string())
        ]).describe("A bible verse reference to search for. e.g. 'John.3.16-17' or 'John'. Results from this search should be presented to the user in the main response."),
        /**
         * Language of the verse to return. Default is "english". If user asks for hebrew, greek, original or transliteration, set this to the appropriate value.
         *
         * @type string
         */
        language: z
            .enum(["english", "hebrew", "greek", "original", "transliteration"])
            .default("english")
            .describe('REQUIRED: Default to "english" unless user specifically asks for hebrew, greek, transliteration or original.')
    }, async ({ verses, language }) => {
        if (!Array.isArray(verses))
            verses = [verses]; // Ensure reference is always an array
        logger.info(`get-verse called with reference: ${JSON.stringify(verses)}, language: ${language}`);
        const versesOut = await getListBibleVerses(verses, language);
        logger.debug(`get-verse returning: ${JSON.stringify(versesOut)}`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(versesOut) || "Verse not found",
                },
            ],
        };
    });
};
/**
 * Adds a tool to get a bible verse given a reference.
 *
 * @param server - The MCP server instance.
 * @returns {McpServer} The updated server with the new tool added.
 */
const addGetBibleVersesOriginalOnly = (server) => {
    return server.tool("get-bible-verses-original-langauge", "Get one or more Bible verse given a list of verse references or whole book names. The language is original for this tool. ALWAYS present the found results to the user. Never say 'no results found' unless the tool explicitly returns empty data. Use the returned information to answer the user's question.", {
        /**
         * A bible verse reference to search for (e.g. "John.3.16-17" or "John"). Results from this search should be presented to the user in the main response
         *
         * @type string or array<string>
         */
        verses: z
            .union([
            z.string(),
            z.array(z.string())
        ]).describe("A bible verse reference to search for. e.g. 'John.3.16-17' or 'John'. Results from this search should be presented to the user in the main response."),
    }, async ({ verses }) => {
        const language = "original"; // Always use original language for this tool
        if (!Array.isArray(verses))
            verses = [verses]; // Ensure reference is always an array
        logger.info(`get-verse called with reference: ${JSON.stringify(verses)}, language: ${language}`);
        const versesOut = await getListBibleVerses(verses, language);
        logger.debug(`get-verse returning: ${JSON.stringify(versesOut)}`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(versesOut) || "Verse not found",
                },
            ],
        };
    });
};
export { addGetBibleVerses, addGetBibleVersesOriginalOnly, getBibleVerses, getListBibleVerses, getOriginalTextVerses, getTransliteratedVerses, };
