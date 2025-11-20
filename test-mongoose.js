// test-mongoose.js
import mongoose from "mongoose";
import Chapter from "./src/models/Chapter.js"; // Adjust path

mongoose.connect("mongodb+srv://aditya9812x_db_user:LQv0iyUIbmvaoos7@cluster0.oas33zm.mongodb.net/birbal_db?retryWrites=true&w=majority&tls=true", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

Chapter.find({}).then(docs => {
  console.log(docs);
  mongoose.disconnect();
});