const fs = require("fs");
const path = require("path");

const lib = {};

lib.basedir = path.join(__dirname, "../.database/");

// read data
lib.read = (dir, callback) => {
  fs.readFile(dir, "utf8", (err, data) => {
    callback(err, data);
  });
};

// update existing file
lib.update = (dir, file, data, callback) => {
  // file open for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert the data to string
      const stringData = JSON.stringify(data);

      // truncate the file
      fs.ftruncate(fileDescriptor, (err1) => {
        if (!err1) {
          // write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err2) => {
            if (!err2) {
              // close the file
              fs.close(fileDescriptor, (err3) => {
                if (!err3) {
                  callback(false);
                } else {
                  callback("Error closing file!");
                }
              });
            } else {
              callback("Error writing to file!");
            }
          });
        } else {
          callback("Error truncating file!");
        }
      });
    } else {
      console.log(`Error updating. File may not exist`);
    }
  });
};

// delete existing file
lib.delete = (dir, file, callback) => {
  // unlink file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(`Error deleting file`);
    }
  });
};

lib.allDir = (dir, callback) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      callback("Error Reading File");
    } else {
      files.forEach((file) => {
        let filePath = path.join(dir, file);
        fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
          callback(err, data);
        });
      });
    }
  });
};

module.exports = lib;
