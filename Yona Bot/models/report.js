const mongoose = require("mongoose");
const reportSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  userID: String,
  reason: String,
  rBy: String,
  rID: String,
  time: String
});
var Report = mongoose.model("Report", reportSchema);
