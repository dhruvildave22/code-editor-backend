const {
  executeCode: executeCodeService,
  SUPPORTED_LANGUAGES,
} = require('../services/code-execution-service');
const { ValidationError } = require('../errors');

/**
 * Execute code in various programming languages and return the output
 */
const executeCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;

    if (!code || typeof code !== 'string') {
      throw new ValidationError('Code is required and must be a string');
    }

    if (code.trim().length === 0) {
      throw new ValidationError('Code cannot be empty');
    }

    if (!language || typeof language !== 'string') {
      throw new ValidationError('Language is required and must be a string');
    }

    // Execute the code
    const result = await executeCodeService(code, language.toLowerCase());

    res.json({
      success: true,
      language: language.toLowerCase(),
      output: result.output,
      error: result.error,
      executionTime: result.executionTime,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of supported programming languages
 */
const getSupportedLanguages = (req, res) => {
  res.json({
    success: true,
    supportedLanguages: SUPPORTED_LANGUAGES,
  });
};

module.exports = {
  executeCode,
  getSupportedLanguages,
};
