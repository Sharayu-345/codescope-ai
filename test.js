const mongoose = require("mongoose");

const uri =
  "mongodb+srv://moresharayu345_db_user:Sharayu%40345@cluster0.3dbtcuf.mongodb.net/codescope-ai?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected Successfully");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
  });