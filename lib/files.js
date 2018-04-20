const fs = require('fs');
const path = require('path');

module.exports = {
    getCurrentDirectoryBase: () => {
        return path.basename(process.cwd());
    },

    directoryExist: (filePath) => {
        if (!isString(filePath)) {
            throw new TypeError('path must be a string or Buffer')
        }

        try {
            return fs.statSync(filePath).isDirectory();
        } catch (err) {
            return false;
        }
    }
};