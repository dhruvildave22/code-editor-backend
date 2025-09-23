const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const parseFile = (filePath, ext) => {
  if (ext === '.csv') {
    const workbook = xlsx.readFile(filePath, {
      raw: true,
      codepage: 65001,
      type: 'string',
    });
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
  } else {
    const workbook = xlsx.readFile(filePath, { raw: true });
    const sheetName = workbook.SheetNames[0];
    return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
  }
};

const exportXlsxOrCsv = (invalidRows, originalFileName) => {
  if (!invalidRows || invalidRows.length === 0) {
    return null;
  }

  const ext = path.extname(originalFileName).toLowerCase();
  let invalidFilePath;

  if (ext === '.csv') {
    const csvContent = [
      Object.keys(invalidRows[0]).join(','), // header
      ...invalidRows.map(row =>
        Object.values(row)
          .map(value => `"${String(value).replace(/"/g, '""')}"`) // escape quotes
          .join(',')
      ),
    ].join('\n');

    invalidFilePath = path.join(
      'uploads',
      `invalid_candidates_${Date.now()}.csv`
    );
    fs.writeFileSync(invalidFilePath, csvContent, 'utf-8');
  } else {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(invalidRows);
    xlsx.utils.book_append_sheet(wb, ws, 'InvalidRows');

    invalidFilePath = path.join(
      'uploads',
      `invalid_candidates_${Date.now()}.xlsx`
    );
    xlsx.writeFile(wb, invalidFilePath);
  }

  return invalidFilePath;
};

module.exports = { parseFile, exportXlsxOrCsv };
