const path = require("path");
const { mkdir, copyFile, readdir, unlink } = require("fs/promises");

const pathToFolder = path.join(__dirname, "files");
const pathToCopyFolder = path.join(__dirname, "files-copy");

(async function () {
  try {
    await mkdir(pathToCopyFolder, { recursive: true });

    const filesCopy = await readdir(pathToCopyFolder, {
      withFileTypes: true,
    });
    for (const fileCopy of filesCopy) {
      await unlink(path.join(pathToCopyFolder, fileCopy.name));
    }

    const files = await readdir(pathToFolder, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        await copyFile(path.join(pathToFolder, file.name), path.join(pathToCopyFolder, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
