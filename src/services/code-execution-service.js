const vm = require('vm');
const { performance } = require('perf_hooks');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Supported programming languages
const SUPPORTED_LANGUAGES = {
  javascript: {
    extension: '.js',
    executor: executeJavaScript,
  },
  python: {
    extension: '.py',
    command: 'python3',
    executor: executeInTerminal,
  },
  ruby: {
    extension: '.rb',
    command: 'ruby',
    executor: executeInTerminal,
  },
  c: {
    extension: '.c',
    compileCommand: 'gcc',
    compileArgs: ['-o'],
    executor: executeCompiledLanguage,
  },
  cpp: {
    extension: '.cpp',
    compileCommand: 'g++',
    compileArgs: ['-o'],
    executor: executeCompiledLanguage,
  },
  java: {
    extension: '.java',
    compileCommand: 'javac',
    runCommand: 'java',
    executor: executeJava,
  },
};

/**
 * Main function to execute code in various programming languages
 * @param {string} code - The source code to execute
 * @param {string} language - The programming language
 * @returns {Promise<Object>} - Result object with output, error, and execution time
 */
const executeCode = async (code, language) => {
  const startTime = performance.now();

  if (!SUPPORTED_LANGUAGES[language]) {
    return {
      output: '',
      error: {
        name: 'UnsupportedLanguageError',
        message: `Language '${language}' is not supported. Supported languages: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`,
      },
      executionTime: 0,
    };
  }

  try {
    const result = await SUPPORTED_LANGUAGES[language].executor(
      code,
      SUPPORTED_LANGUAGES[language]
    );
    const endTime = performance.now();
    const executionTime = Math.round(endTime - startTime);

    return {
      ...result,
      executionTime,
    };
  } catch (error) {
    const endTime = performance.now();
    const executionTime = Math.round(endTime - startTime);

    return {
      output: '',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      executionTime,
    };
  }
};

/**
 * Execute JavaScript code safely in a sandboxed environment
 * @param {string} code - The JavaScript code to execute
 * @returns {Promise<Object>} - Result object with output and error
 */
async function executeJavaScript(code) {
  let output = '';
  let error = null;

  try {
    // Create a secure sandbox context
    const sandbox = {
      console: {
        log: (...args) => {
          output +=
            args
              .map(arg =>
                typeof arg === 'object'
                  ? JSON.stringify(arg, null, 2)
                  : String(arg)
              )
              .join(' ') + '\n';
        },
        error: (...args) => {
          output +=
            'ERROR: ' +
            args
              .map(arg =>
                typeof arg === 'object'
                  ? JSON.stringify(arg, null, 2)
                  : String(arg)
              )
              .join(' ') +
            '\n';
        },
        warn: (...args) => {
          output +=
            'WARN: ' +
            args
              .map(arg =>
                typeof arg === 'object'
                  ? JSON.stringify(arg, null, 2)
                  : String(arg)
              )
              .join(' ') +
            '\n';
        },
        info: (...args) => {
          output +=
            'INFO: ' +
            args
              .map(arg =>
                typeof arg === 'object'
                  ? JSON.stringify(arg, null, 2)
                  : String(arg)
              )
              .join(' ') +
            '\n';
        },
      },
      // Add safe global objects
      Math,
      Date,
      JSON,
      Array,
      Object,
      // Add some safe utility functions
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      String,
      Number,
      Boolean,
    };

    // Create a new context for the sandbox
    const context = vm.createContext(sandbox);

    // Execute the code with timeout
    const result = vm.runInContext(code, context, {
      timeout: 5000, // 5 seconds timeout
      displayErrors: false,
    });

    // If the code returns a value, add it to output
    if (result !== undefined) {
      output +=
        typeof result === 'object'
          ? JSON.stringify(result, null, 2)
          : String(result);
    }
  } catch (err) {
    error = {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }

  return {
    output: output.trim(),
    error,
  };
}

/**
 * Execute code in languages that don't need compilation (Python)
 * @param {string} code - The source code to execute
 * @param {Object} config - Language configuration
 * @returns {Promise<Object>} - Result object with output and error
 */
async function executeInTerminal(code, config) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-exec-'));
  const fileName = `main${config.extension}`;
  const filePath = path.join(tempDir, fileName);

  try {
    // Write code to temporary file
    await fs.writeFile(filePath, code);

    // Execute the code
    const result = await execPromise(`${config.command} "${filePath}"`, {
      timeout: 10000,
      cwd: tempDir,
    });

    return {
      output: result.stdout.trim(),
      error: result.stderr ? { message: result.stderr.trim() } : null,
    };
  } finally {
    // Clean up temporary files
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Silent cleanup failure - we don't want to break the main execution
    }
  }
}

/**
 * Execute compiled languages (C, C++)
 * @param {string} code - The source code to execute
 * @param {Object} config - Language configuration
 * @returns {Promise<Object>} - Result object with output and error
 */
async function executeCompiledLanguage(code, config) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-exec-'));
  const fileName = `main${config.extension}`;
  const filePath = path.join(tempDir, fileName);
  const executablePath = path.join(tempDir, 'main');

  try {
    // Write code to temporary file
    await fs.writeFile(filePath, code);

    // Compile the code
    const compileCmd = `${config.compileCommand} ${config.compileArgs.join(' ')} "${executablePath}" "${filePath}"`;
    const compileResult = await execPromise(compileCmd, {
      timeout: 10000,
      cwd: tempDir,
    });

    if (compileResult.stderr) {
      return {
        output: '',
        error: { message: `Compilation Error: ${compileResult.stderr.trim()}` },
      };
    }

    // Execute the compiled binary
    const execResult = await execPromise(`"${executablePath}"`, {
      timeout: 10000,
      cwd: tempDir,
    });

    return {
      output: execResult.stdout.trim(),
      error: execResult.stderr ? { message: execResult.stderr.trim() } : null,
    };
  } finally {
    // Clean up temporary files
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Silent cleanup failure - we don't want to break the main execution
    }
  }
}

/**
 * Execute Java code (special case for compiled language)
 * @param {string} code - The Java source code to execute
 * @param {Object} config - Language configuration
 * @returns {Promise<Object>} - Result object with output and error
 */
async function executeJava(code, config) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-exec-'));

  // Extract class name from code
  const classNameMatch = code.match(/public\s+class\s+(\w+)/);
  if (!classNameMatch) {
    return {
      output: '',
      error: {
        message:
          'No public class found. Java code must contain a public class.',
      },
    };
  }

  const className = classNameMatch[1];
  const fileName = `${className}.java`;
  const filePath = path.join(tempDir, fileName);

  try {
    // Write code to temporary file
    await fs.writeFile(filePath, code);

    // Compile the code
    const compileResult = await execPromise(
      `${config.compileCommand} "${filePath}"`,
      {
        timeout: 10000,
        cwd: tempDir,
      }
    );

    if (compileResult.stderr) {
      return {
        output: '',
        error: { message: `Compilation Error: ${compileResult.stderr.trim()}` },
      };
    }

    // Execute the compiled class
    const execResult = await execPromise(`${config.runCommand} ${className}`, {
      timeout: 10000,
      cwd: tempDir,
    });

    return {
      output: execResult.stdout.trim(),
      error: execResult.stderr ? { message: execResult.stderr.trim() } : null,
    };
  } finally {
    // Clean up temporary files
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Silent cleanup failure - we don't want to break the main execution
    }
  }
}

/**
 * Promisified version of child_process.exec
 * @param {string} command - The command to execute
 * @param {Object} options - Execution options
 * @returns {Promise<Object>} - Promise that resolves with stdout and stderr
 */
function execPromise(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error && error.code !== 0 && !stdout) {
        // Only reject if there's an error AND no stdout (compilation errors should be handled gracefully)
        reject(error);
      } else {
        resolve({ stdout: stdout || '', stderr: stderr || '' });
      }
    });
  });
}

module.exports = {
  executeCode,
  SUPPORTED_LANGUAGES: Object.keys(SUPPORTED_LANGUAGES),
};
