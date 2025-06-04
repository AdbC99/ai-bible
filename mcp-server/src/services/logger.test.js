import logger from './logger';
import { jest } from '@jest/globals';


describe('Logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should log a message with the correct level', () => {
    // Note that this test could fail if DEBUG is set to true in the environment
    const message = 'Test message';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    logger.info(message);

    expect(consoleErrorSpy).toHaveBeenCalledWith(`INFO: ${JSON.stringify(message)}\n`);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});