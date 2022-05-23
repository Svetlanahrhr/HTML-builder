const fs = require("fs");
const path = require("path");

fs.mkdir(
  path.join(__dirname, "project-dist"),
  { recursive: true, force: true },
  (err) => {
    if (err) throw err;
  }
);

let read = fs.createReadStream(path.join(__dirname, "template.html"));
let header = "";
let footer = "";
let articles = "";
let res = "";
let newRes = "";

let readerHeader = fs.createReadStream(
  path.join(__dirname, "components", "header.html")
);
let readerFooter = fs.createReadStream(
  path.join(__dirname, "components", "footer.html")
);
let readerArticles = fs.createReadStream(
  path.join(__dirname, "components", "articles.html")
);

readerHeader
  .on("error", (err) => {
    if (err) throw err;
  })
  .on("data", (chunk) => {
    header += chunk.toString();
  })
  .on("end", () => {
    //   console.log(header);
  });
readerFooter
  .on("error", (err) => {
    if (err) throw err;
  })
  .on("data", (chunk) => {
    footer += chunk.toString();
  })
  .on("end", () => {
    //   console.log(header);
  });
readerArticles
  .on("error", (err) => {
    if (err) throw err;
  })
  .on("data", (chunk) => {
    articles += chunk.toString();
  })
  .on("end", () => {
    //   console.log(header);
  });

read
  .on("error", (err) => {
    if (err) throw err;
  })
  .on("data", (chunk) => {
    res += chunk.toString();
  })
  .on("end", () => {
    newRes = res.replace(/{{footer}}/gi, footer);
    newRes = newRes.replace(/{{articles}}/gi, articles);
    newRes = newRes.replace(/{{header}}/gi, header);
    // console.log(newRes);
    let writer = fs.createWriteStream(
      path.join(__dirname, "project-dist", "index.html")
    );
    writer.write(newRes);
  });

//styles

let resStyles = "";

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
            path.join(__dirname, "project-dist", "style.css")
          );
          const handlError = () => {
            if (err) throw err;
            reader.destroy();
            writer.end("Finished with err...");
          };
          reader
            .on("error", handlError)
            .on("data", (chunk) => {
              resStyles += "\n";
              resStyles += chunk.toString();
            })
            .on("end", () => {
              writer.write(resStyles);
            });
        }
      }
    });
  }
);

//assets

function creatDir(dirName) {
  fs.mkdir(
    path.join(__dirname, "project-dist", "assets", dirName),
    { recursive: true, force: true },
    (err) => {
      if (err) throw err;
    }
  );
}

fs.mkdir(
  path.join(__dirname, "project-dist", "assets"),
  { recursive: true },
  (err) => {
    if (err) throw err;
  }
);
fs.mkdir(
  path.join(__dirname, "project-dist", "assets", "fonts"),
  { recursive: true },
  (err) => {
    if (err) throw err;
  }
);
fs.mkdir(
  path.join(__dirname, "project-dist", "assets", "img"),
  { recursive: true },
  (err) => {
    if (err) throw err;
  }
);
fs.mkdir(
  path.join(__dirname, "project-dist", "assets", "svg"),
  { recursive: true },
  (err) => {
    if (err) throw err;
  }
);

function readDir(readingDirName) {
  fs.readdir(
    path.join(__dirname, readingDirName),
    { withFileTypes: true },
    (err, data) => {
      if (err) throw err;
      data.forEach((file) => {
        if (!file.isFile()) {
          readingDirName += "/";
          readingDirName += file.name;
          readDir(readingDirName);
          creatDir(file.name);
        } else {
          console.log(file.name);
          fs.copyFile(
            path.join(__dirname, readingDirName, file.name),
            path.join(__dirname, "project-dist", readingDirName, file.name),
            (err) => {
              if (err) throw err;
            }
          );
        }
      });
    }
  );
}

readDir("assets/fonts");
readDir("assets/img");
readDir("assets/svg");
