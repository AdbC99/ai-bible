import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getBibleVerses } from "./services/berean.js";
import { z } from "zod";

/**
 * Creates a new instance of the MCP server.
 *
 * @param name - The name of the server.
 * @param version - The version of the server.
 */
const createServer = (name: string, version: string) => {
    const capabilities = {
        resources: {},
        tools: {},
    };

    return new McpServer({
        name,
        version,
        capabilities,
    });
};

/**
 * Adds a tool to get a bible verse given a reference.
 *
 * @param server - The MCP server instance.
 * @returns {McpServer} The updated server with the new tool added.
 */
const addGetVerseTool = (server: McpServer) => {
    return server.tool(
        "get-verse",
        "Get Bible verse given a verse reference",
        {
            /**
             * A bible verse reference (e.g. John.3.16-17)
             *
             * @type string
             */
            reference: z.string().describe("A bible verse reference"),
        },
        async ({ reference }) => {
            const list = getBibleVerses(reference);
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

const main = async () => {
    const transport = new StdioServerTransport();
    const server = createServer("ai-bible-mcp-server", "1.0.0");
    addGetVerseTool(server);

    await server.connect(transport);
    console.error("MCP Server running on stdio");
};

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
