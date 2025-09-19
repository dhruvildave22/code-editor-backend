const UserService = require('../services/user-service');
const { BaseClientError } = require('../errors');
const xlsx = require('xlsx');
const fs = require('fs');
const { createCandidateSchema } = require('../validations/user-validation');

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

async function createCandidateUser(req, res, next) {
  try {
    const { body } = req;
    const user = await UserService.createCandidate(body);
    res.status(201).json({ message: 'Candidate created successfully', user });
  } catch (err) {
    if (err instanceof BaseClientError) {
      return next(err);
    }
    next(err);
  }
}

async function createCandidatesFromExcel(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel file is required' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const results = [];

    for (const row of sheetData) {
      try {
        const validated = createCandidateSchema.parse({
          firstName: row['First Name'],
          lastName: row['Last Name'],
          email: row['Email'],
        });

        const user = await UserService.createCandidate(validated);

        results.push({ success: true, user });
      } catch (err) {
        if (err.name === 'ZodError') {
          const issues = err.issues || err.errors || [];
          results.push({
            success: false,
            error: issues.length > 0 ? issues[0].message : 'Validation failed',
            details: issues,
            row,
          });
        } else {
          results.push({
            success: false,
            error: err.message || 'Unknown error',
            row,
          });
        }
      }
    }

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: 'Excel processed',
      results,
    });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    if (err instanceof BaseClientError) {
      return next(err);
    }
    next(err);
  }
}

module.exports = {
  registerUser,
  loginUser,
  createCandidateUser,
  createCandidatesFromExcel,
};
