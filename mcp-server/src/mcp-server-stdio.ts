import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { addGetVersesTool, addGetOriginalTextVerseTool, addTransliteratedVerseTool } from "./mcp-server-tools.js";

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

const main = async () => {
    const transport = new StdioServerTransport();
    const server = createServer("ai-bible-mcp-server", "1.0.0");
    addGetVersesTool(server);
    addGetOriginalTextVerseTool(server);
    addTransliteratedVerseTool(server);

    await server.connect(transport);
    console.error("MCP Server running on stdio");
};

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
