const fs = require("fs");
const path = require("path");

let res = "";

fs.readdir(
  path.join(__dirname, "styles"),
  { withFileTypes: true },
  (err, data) => {
    if (err) throw err;
    data.forEach((file) => {
      if (file.isFile()) {
        let [name, exten] = file.name.split(".");
        if (exten === "css") {
          let reader = fs.createReadStream(
            path.join(__dirname, "styles", file.name)
          );
          let writer = fs.createWriteStream(
            path.join(__dirname, "project-dist", "bundle.css")
          );
          const handlError = () => {
            if (err) throw err;
            reader.destroy();
            writer.end("Finished with err...");
          };
          reader
            .on("error", handlError)
            .on("data", (chunk) => {
              res += "\n";
              res += chunk.toString();
            })
            .on("end", () => {
              writer.write(res);
            });
        }
      }
    });
  }
);
