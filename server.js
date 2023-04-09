const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const { PORT, DB_HOST } = process.env;

// (function () {
//   var childProcess = require("child_process");
//   var oldSpawn = childProcess.spawn;
//   function mySpawn() {
//     console.log("spawn called");
//     console.log(arguments);
//     var result = oldSpawn.apply(this, arguments);
//     return result;
//   }
//   childProcess.spawn = mySpawn;
// })();

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT, () => {
      console.log("Database connection successful");
    })
  )
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
