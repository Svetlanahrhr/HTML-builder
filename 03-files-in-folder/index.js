const fs = require("fs");
const path = require("path");

fs.readdir(
  path.join(__dirname, "secret-folder"),
  { withFileTypes: true },
  (err, data) => {
    if (err) throw err;
    data.forEach((file) => {
      fs.stat(
        path.join(__dirname, "secret-folder", file.name),
        (err, data1) => {
          if (err) throw err;
          if (file.isFile()) {
            let [name, exten] = file.name.split(".");
            console.log(name, " - ", exten, " - ", data1.size, 'b');
          }
        }
      );
    });
  }
);
