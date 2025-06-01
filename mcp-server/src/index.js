"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var berean_js_1 = require("./services/berean.js");
var zod_1 = require("zod");
/**
 * Creates a new instance of the MCP server.
 *
 * @param name - The name of the server.
 * @param version - The version of the server.
 */
var createServer = function (name, version) {
    var capabilities = {
        resources: {},
        tools: {},
    };
    return new mcp_js_1.McpServer({
        name: name,
        version: version,
        capabilities: capabilities,
    });
};
/**
 * Adds a tool to get a bible verse given a reference.
 *
 * @param server - The MCP server instance.
 * @returns {McpServer} The updated server with the new tool added.
 */
var addGetVerseTool = function (server) {
    return server.tool("get-verse", "Get Bible verse given a verse reference", {
        /**
         * A bible verse reference (e.g. John.3.16-17)
         *
         * @type string
         */
        reference: zod_1.z.string().describe("A bible verse reference"),
    }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var list;
        var reference = _b.reference;
        return __generator(this, function (_c) {
            list = (0, berean_js_1.getBibleVerses)(reference);
            return [2 /*return*/, {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(list) || "Verse not found",
                        },
                    ],
                }];
        });
    }); });
};
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var transport, server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                transport = new stdio_js_1.StdioServerTransport();
                server = createServer("ai-bible-mcp-server", "1.0.0");
                addGetVerseTool(server);
                return [4 /*yield*/, server.connect(transport)];
            case 1:
                _a.sent();
                console.error("MCP Server running on stdio");
                return [2 /*return*/];
        }
    });
}); };
main().catch(function (error) {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
