const fs = require("fs");
const path = require("path");
const { stdout } = require("process");

let readeStream = fs.createReadStream(path.join(__dirname, "text.txt"));

readeStream.pipe(stdout).on("error", (err) => console.log(err));
