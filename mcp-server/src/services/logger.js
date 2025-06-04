import fs from 'fs';

function log(message) {
    const debugMode = process.env.DEBUG === 'true';

    if (debugMode) {
        const filePath = './ai-bible-mcp-server.log'; // Update this path to your desired log file location
        fs.appendFile(filePath, message, (err) => {
            if (err) console.error(`Error writing to file: ${err}`);
        });
    } else {
        console.error(message);
    }
}

/**
 * Logs a message at the speicfied level.
 *
 * @param {string} message - The message to be logged.
 */
const logger = {
    /**
     * Logs an information level message.
     * @memberof logger
     * @instance
     * @method info
     * @static
     * @param {string} message - The message to be logged.
     */
    info: (message) => {
        log(`INFO: ${JSON.stringify(message)}\n`);
    },

    /**
     * Logs an information level message.
     * @memberof logger
     * @instance
     * @method error
     * @static
     * @param {string} message - The message to be logged.
     */
    error: (message) => {
        log(`ERROR: ${JSON.stringify(message)}`);
    }
}

export default logger;
