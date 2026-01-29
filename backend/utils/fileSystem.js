const fs = require('fs');

const ensureDirectoryExists = (path) => {
    try {
        if (!fs.existsSync(path)) {
            // Mode 0o755 provides read/write for owner and read for others
            fs.mkdirSync(path, { recursive: true, mode: 0o755 });
            console.log(`Directory created at: ${path}`);
        }
    } catch (err) {
        if (err.code === 'EEXIST') {
            console.log(`Directory already exists at: ${path}`);
        } else {
            console.error(`Error creating directory: ${err}`);
        }
    }
}

module.exports = {
    ensureDirectoryExists
};