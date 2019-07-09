// Code Last updated 7/2/19
// By Cody Ridener
// A function for reporting users. After the user is reported the report log is then
// sent to a MongoDB database.
// imports discord.js for bot commands
const Discord  = require("discord.js");
var Promise = require('bluebird');
const mongoose = require("mongoose");
// Connects to a mongodb dabatase using the node.js package Mongoose.
mongoose.connect('mongodb://localhost/Reports');
// Creates a mongoose schema that's used to format the report in the database.
const reportSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  userID: String,
  reason: String,
  rBy: String,
  rID: String,
  time: String
});
// Makes an object that will be used to generate a report that can then be stored in the mongoDB databse.
var Report = mongoose.model("Report", reportSchema);
// Instantiates the Node.js module that will run the inputted arguments from the Index.js file.
module.exports.run = async (bot, message,args) => {
  // The program waits until the initial message is deleted.
  await message.delete();
  // Checks if the author is the bot owner.
  if(message.author.id != '258438246973833219') return;
  // Finds the first mentioned user in the message. This is the user that is being reported.
  let rUser = message.mentions.members.first();
  // Checks if the message has a member that was mentioned.
  if(!rUser) return message.reply("Can't find that member.")
  // Gets the reason for the report.
  let rreason  = args.slice(1).join(" ");
  // Checks if the reason exists, and that the user inputted the commands in the correct order.
  if(!rreason || rUser == rreason) return message.reply("Please supply a reason. Or use format report [user] [reason]");
  // Creates a discord rich embed that is posted to the current channel.
  let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#FF0000")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason",rreason);
    //Finds the channel to post the report to.
  let reportschannel = message.guild.channels.find(`name`, "general");
  // Returns a message if there is no reports channel.
  if(!reportschannel) return message.channel.send("Couldn't find reports channel");
  // Sends the report.
  reportschannel.send(reportEmbed);
// Creates a new report using a Schema from Mongoose.
  var report = new Report({
    _id: new mongoose.Types.ObjectId(),
    username: rUser.user.username,
    userID: rUser.id,
    reason: rreason,
    rBy: message.author.username,
    rID: message.author.id,
    time: message.createdAt
  });
  // Saves the report posting it to the databse.
  report.save()
  .then(result => console.log(result))
  .catch(err => console.log(err));
  message.channel.send("Recorded");
}
module.exports.help = {
  name: "report"
}
