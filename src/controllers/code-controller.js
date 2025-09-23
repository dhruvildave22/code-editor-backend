const {
  executeCode: executeCodeService,
  SUPPORTED_LANGUAGES,
} = require('../services/code-execution-service');

/**
 * Execute code in various programming languages and return the output
 */
const executeCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;

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
