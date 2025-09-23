const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { parseFile } = require('../utils/sheet-utils');

const upload = multer({ dest: 'uploads/' });

const requiredColumns = ['First Name', 'Last Name', 'Email'];

function validateCandidateRows(rows, schema) {
  return rows.map(row => {
    try {
      const parsed = schema.parse({
        firstName: row['First Name'],
        lastName: row['Last Name'],
        email: row['Email'],
      });
      return { ...parsed, isValid: true, originalRow: row };
    } catch (err) {
      return {
        ...row,
        isValid: false,
        error: err.issues?.[0]?.message || err.message || 'Validation failed',
      };
    }
  });
}

const validateCandidateFile = bulkCandidateCreateSchema => {
  return (req, res, next) => {
    upload.single('file')(req, res, function (err) {
      if (err) {
        return res
          .status(400)
          .json({ message: 'File upload failed', error: err.message });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ message: 'File is required' });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();

        if (!['.xlsx', '.csv'].includes(ext)) {
          fs.unlinkSync(req.file.path);
          return res
            .status(400)
            .json({ message: 'Only .xlsx and .csv files are allowed' });
        }

        const rows = parseFile(req.file.path, ext);

        const hasValidColumns = requiredColumns.every(col =>
          Object.keys(rows[0] || {}).includes(col)
        );

        if (!hasValidColumns) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({
            message: `File must include the following columns: ${requiredColumns.join(', ')}`,
          });
        }

        req.validatedRows = validateCandidateRows(
          rows,
          bulkCandidateCreateSchema
        );
        fs.unlinkSync(req.file.path);
        next();
      } catch (err) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        next(err);
      }
    });
  };
};

module.exports = {
  validateCandidateFile,
};
