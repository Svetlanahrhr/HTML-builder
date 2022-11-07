const fs = require("fs");
const path = require("path");

(async function () {
  await createDir();
  await copyAssets(
    path.join(__dirname, "assets"),
    path.join(__dirname, "project-dist", "assets")
  );
  await copyStyles();
  await createHTMLFile();
})();

async function createDir() {
  try {
    await fs.promises.stat(path.join(__dirname, "project-dist"));
    await fs.promises.rm(path.join(__dirname, "project-dist"), {
      recursive: true,
    });
  } catch (err) {
    // console.log(err);
  }

  await fs.promises.mkdir(path.join(__dirname, "project-dist", "assets"), {
    recursive: true,
  });
}
async function copyAssets(pathToAssets, pathToNewAssets) {
  try {
    const files = await fs.promises.readdir(pathToAssets, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        await fs.promises.copyFile(
          path.join(pathToAssets, file.name),
          path.join(pathToNewAssets, file.name)
        );
      } else {
        await fs.promises.mkdir(path.join(pathToNewAssets, file.name), {
          recursive: true,
        });
        await copyAssets(
          path.join(pathToAssets, file.name),
          path.join(pathToNewAssets, file.name)
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}
async function copyStyles() {
  let res = "";
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
          path.join(__dirname, "project-dist", "style.css")
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
}
async function readData() {
  try {
    const files = await fs.promises.readdir(
      path.join(__dirname, "components"),
      {
        withFileTypes: true,
      }
    );

    const dataStore = {};

    for (const file of files) {
      if (file.isFile()) {
        const data = await fs.promises.readFile(
          path.join(path.join(__dirname, "components"), file.name),
          "utf-8"
        );
        dataStore[file.name] = data;
      }
    }

    return dataStore;
  } catch (err) {
    console.log(err.message);
  }
}
async function createHTMLFile() {
  const componentsData = await readData();

  let templateData = await fs.promises.readFile(
    path.join(__dirname, "template.html"),
    "utf-8"
  );

  for (const [key, value] of Object.entries(componentsData)) {
    templateData = templateData.replace(
      new RegExp(`{{${path.basename(key, ".html")}}}`, "g"),
      value
    );
  }

  fs.promises.writeFile(
    path.join(__dirname, "project-dist", "index.html"),
    `${templateData}`
  );
}
