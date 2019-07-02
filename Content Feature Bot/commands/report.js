const Discord  = require("discord.js");
var Promise = require('bluebird');
const mongoose = require("mongoose");
mongoose.connect('mongodb://kidcacti:kidcacti@192.34.62.13:27017/buckets');
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
module.exports.run = async (bot, message,args) => {
  await message.delete();
  if(message.author.id != '258438246973833219') return;
  let rUser = message.mentions.members.first();
  if(!rUser) return message.reply("Can't find that member.")
  let rreason  = args.slice(1).join(" ");
  if(!rreason || rUser == rreason) return message.reply("Please supply a reason. Or use format report [user] [reason]");
  let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#FF0000")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason",rreason);
  let reportschannel = message.guild.channels.find(`name`, "general");
  if(!reportschannel) return message.channel.send("Couldn't find reports channel");
  reportschannel.send(reportEmbed);

  var report = new Report({
    _id: new mongoose.Types.ObjectId(),
    username: rUser.user.username,
    userID: rUser.id,
    reason: rreason,
    rBy: message.author.username,
    rID: message.author.id,
    time: message.createdAt
  });
  report.save()
  .then(result => console.log(result))
  .catch(err => console.log(err));
  message.channel.send("Recorded");
}
module.exports.help = {
  name: "report"
}
