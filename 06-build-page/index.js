const fs = require("fs");
const path = require("path");

fs.mkdir(path.join(__dirname, "project-dist"),{ recursive: true, force: true }, (err) => {
    if (err) throw err;
})

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
    console.log(newRes);
    let writer = fs.createWriteStream(
    path.join(__dirname, "project-dist", "index.html")
  );
  writer.write(newRes)

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
// fs.mkdir(
//     path.join(__dirname, "project-dist", "assets"),
//     { recursive: true },
//     (err) => {
//       if (err) throw err;
//     }
//   );
// fs.createReadStream(path.join(__dirname, 'assets')).pipe(fs.createWriteStream(path.join(__dirname, 'project-dist','assets')));


  
//   fs.readdir(path.join(__dirname, "assets"),{ withFileTypes: true }, (err, data) => {
//     if (err) throw err;
//     data.forEach((file) => {
      
//             fs.mkdir(
//                 path.join(__dirname, "project-dist", "assets", file.name),
//                 { recursive: true },
//                 (err) => {
//                   if (err) throw err;
//                 }
//               );
//             fs.readdir(path.join(__dirname, "assets", file.name), (err, data) => {
//                 if (err) throw err;
//                 data.forEach(file => {
//                     fs.copyFile(
//                         path.join(__dirname, "assets", file),
//                         path.join(__dirname, "project-dist", "assets", file),
//                         (err) => {
//                           if (err) throw err;
//                         }
//                       );
//                 })
//             })
        
    //   fs.copyFile(
    //     path.join(__dirname, "assets", file),
    //     path.join(__dirname, "project-dist", file),
    //     (err) => {
    //       if (err) throw err;
    //     }
    //   );
    // });
//   });


