// scheduler.js
const fs = require('fs');
const path = require('path');

// Set the folder path to monitor for files
const folderPath = path.join(__dirname, '..', 'data'); // Adjust the path as needed

// Function to check for files with today's date
function checkForTodaysFiles() {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Searching for files with today's date: ${today}`);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            process.send({ message: `No file Found` });
        }

        files.forEach((file) => {
            if (file.includes(today)) {
                console.log(`File found for today: ${file}`);
                process.send({ message: `File found for today: ${file}` });
            }
        });
    });
}

// Run the file check every minute
setInterval(checkForTodaysFiles, 60000); // 60000 ms = 1 minute

// Log when the scheduler starts
console.log("File-checking scheduler started, monitoring folder:", folderPath);
