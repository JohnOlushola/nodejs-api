import mongoose from "mongoose";

class Database {
  connect() {
    mongoose.connect(
      process.env.DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.log("Database connection failed");
        }
        console.log("Database connection succesfull");
      }
    );

    //Get the default connection
    let db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
  }
}

export default new Database();
