const fs = require('fs');

const filePath = './node_modules/typeorm/driver/capacitor/CapacitorQueryRunner.js';
const lineToModify = 61;
const replacementText = '    else if (["INSERT", "UPDATE", "DELETE"].indexOf(command) !== -1) {';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Split data by line
  const lines = data.split('\n');

  // Modify the specific line
  if (lines.length >= lineToModify) {
    lines[lineToModify - 1] = replacementText; // Line numbers are 1-based
  } else {
    console.error('Line number to modify is out of range.');
    return;
  }

  // Join lines back together
  const modifiedData = lines.join('\n');

  // Write the modified data back to the file
  fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File modified successfully.');
  });
});