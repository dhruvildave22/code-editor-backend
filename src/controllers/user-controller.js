const UserService = require('../services/user-service');
const { BaseClientError } = require('../errors');
const { exportXlsxOrCsv } = require('../utils/sheet-utils');

async function registerUser(req, res, next) {
  try {
    const { body } = req;
    const user = await UserService.register(body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    // If it's a custom client error, let the error handler deal with it
    if (err instanceof BaseClientError) {
      return next(err);
    }

    // Handle legacy error messages for backward compatibility
    if (err.message === 'Email already registered') {
      return res.status(409).json({ error: err.message });
    }
    if (err.message === 'Invalid user type') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { body } = req;
    const result = await UserService.authenticate(body);
    res.json(result);
  } catch (err) {
    // If it's a custom client error, let the error handler deal with it
    if (err instanceof BaseClientError) {
      return next(err);
    }

    // Handle legacy error messages for backward compatibility
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ error: err.message });
    }
    next(err);
  }
}

async function createCandidate(req, res, next) {
  try {
    const { body } = req;
    const candidate = await UserService.createCandidate(body);
    res
      .status(201)
      .json({ message: 'Candidate created successfully', candidate });
  } catch (err) {
    if (err instanceof BaseClientError) {
      return next(err);
    }
    next(err);
  }
}

async function createCandidatesFromSheet(req, res, next) {
  try {
    const validRows = [];
    const invalidRows = [];

    for (const row of req.validatedRows) {
      if (row.isValid) {
        try {
          const user = await UserService.createCandidate(row);
          if (!user) {
            throw new Error('User creation failed');
          }
          validRows.push({ success: true, user });
        } catch (err) {
          invalidRows.push({
            ...row.originalRow,
            Error: err.message || 'User creation failed',
          });
        }
      } else {
        const inValidRecord = { ...row };
        delete inValidRecord.isValid;
        invalidRows.push(inValidRecord);
      }
    }

    let invalidFilePath = null;

    if (invalidRows.length > 0) {
      invalidFilePath = exportXlsxOrCsv(invalidRows, req.file.originalname);
    }

    res.status(201).json({
      message: 'Excel processed',
      total: req.validatedRows.length,
      created: validRows.length,
      failed: invalidRows.length,
      invalidFile: invalidFilePath ? `/${invalidFilePath}` : null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerUser,
  loginUser,
  createCandidate,
  createCandidatesFromSheet,
};
