const fs = require("fs");
const path = require("path");
//File system

// fs.mkdir(path.join(__dirname, "notes"), (err) => {
//   if (err) throw new Error(err);

//   console.log("папка создана");
// });

// fs.writeFile(path.join(__dirname, "notes", "notes.txt"), "Test text", (err) => {
//   if (err) throw new Error(err);

//   console.log("файл создан");

//   fs.appendFile(
//     path.join(__dirname, "notes", "notes.txt"),
//     " new text appended",
//     (err) => {
//       if (err) throw new Error(err);

//       console.log("файл изменен");
//       fs.readFile(
//         path.join(__dirname, "notes", "notes.txt"),
//         "utf-8",
//         (err, data) => {
//           if (err) throw new Error(err);

//           console.log(data);
//         }
//       );
//     }
//   );
// });

fs.rename(
  path.join(__dirname, "notes", "notes.txt"),
  path.join(__dirname, "notes", "renameNotes.txt"),
  (err) => {
    if (err) throw new Error(err);

    console.log("файл переименован");
  }
);
