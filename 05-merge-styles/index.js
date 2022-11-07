const fs = require("fs");
const path = require("path");

let res = "";

(async function () {
  let filesInFolderStyle = await fs.promises.readdir(
    path.join(__dirname, "styles"),
    { withFileTypes: true }
  );
  filesInFolderStyle.forEach((fileFromStyleFolder) => {
    if (fileFromStyleFolder.isFile()) {
      let exten = path.parse(fileFromStyleFolder.name).ext.slice(1);
      if (exten === "css") {
        let reader = fs.createReadStream(
          path.join(__dirname, "styles", fileFromStyleFolder.name)
        );
        let writer = fs.createWriteStream(
          path.join(__dirname, "project-dist", "bundle.css")
        );
        const handlError = (err) => {
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
})();
