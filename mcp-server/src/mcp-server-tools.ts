import { getBibleVerses, getOriginalTextVerses, getTransliteratedVerses } from "./services/berean.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Adds a tool to get a bible verse given a reference.
 *
 * @param server - The MCP server instance.
 * @returns {McpServer} The updated server with the new tool added.
 */
const addGetVersesTool = (server: McpServer) => {
    return server.tool(
        "get-verses",
        "Get a Bible verse given a list of verse references or whole book names",
        {
            /**
             * A list of bible verse reference (e.g. ["John.3.16-17"], ["John"] or ["John.3.16", "John.3.17"])
             *
             * @type string
             */
            reference: z.array(z.string()).describe("A bible verse reference"),
        },
        async ({ reference }) => {
            const verses: Record<string, string[]> = {};
            if (reference.length > 0) {
                for (const ref of reference) {
                    const list = await getBibleVerses(ref);
                    if (list) {
                        verses[ref] = list;
                    }
                }
            }
                
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(verses) || "Verse not found",
                    },
                ],
            };
        }
    );
};

/**
 * Adds a tool to get a bible verse in original text given a reference.
 *
 * @param server - The MCP server instance.
 * @returns {McpServer} The updated server with the new tool added.
 */
const addGetOriginalTextVerseTool = (server: McpServer) => {
    return server.tool(
        "get-original-text-verse",
        "Get a Bible verse in orginal text given a verse reference",
        {
            /**
             * A bible verse reference (e.g. John.3.16-17)
             *
             * @type string
             */
            reference: z.string().describe("A bible verse reference"),
        },
        async ({ reference }) => {
            const list = getOriginalTextVerses(reference);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(list) || "Verse not found",
                    },
                ],
            };
        }
    );
};

/**
 * Adds a tool to get a bible verse in transliterated original text given a reference.
 *
 * @param server - The MCP server instance.
 * @returns {McpServer} The updated server with the new tool added.
 */
const addTransliteratedVerseTool = (server: McpServer) => {
    return server.tool(
        "get-transliterated-verse",
        "Get a Bible verse in transliterated orginal text given a verse reference",
        {
            /**
             * A bible verse reference (e.g. John.3.16-17)
             *
             * @type string
             */
            reference: z.string().describe("A bible verse reference"),
        },
        async ({ reference }) => {
            const list = getTransliteratedVerses(reference);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(list) || "Verse not found",
                    },
                ],
            };
        }
    );
};

export {
    addGetVersesTool,
    addGetOriginalTextVerseTool,
    addTransliteratedVerseTool,
    getBibleVerses,
    getOriginalTextVerses,
    getTransliteratedVerses,
}