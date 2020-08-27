const server = require("./server");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

require("dotenv").config({ path: ".env" });
const { MONGO_DB_CONNECTION_STRING, NODE_ENV } = process.env;

if (NODE_ENV === "production") {
  console.log("Using Production MongoDB");
  mongoose
    .connect(MONGO_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      server.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
      });
    });
} else {
  console.log("Connecting to local MongoDB");
  mongoose
    .connect("mongodb://localhost/flash2020", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      server.listen(port, () => {
        console.log(`Server is listening on http://localhost:${port}`);
      });
    });
}