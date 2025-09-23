// 1. Import path module
const path = require("path");

// 2. Get full path of this file
console.log("Full file path:", __filename);

// 3. Get directory path
console.log("Folder path:", __dirname);

// 4. Get file extension
console.log("File extension:", path.extname(__filename));

// 5. Get file name
console.log("File name:", path.basename(__filename));

// 6. Join paths safely
let newPath = path.join(__dirname, "files", "test.txt");
console.log("New Path:", newPath);
