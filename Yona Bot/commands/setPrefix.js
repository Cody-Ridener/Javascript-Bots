// Written 7/2/19
// Written by Cody Ridener
// Changes the command prefix for the bot.

// Require discord.js for the file.
const Discord = require('discord.js');
// Require the bot config file we'll be editing it.
const config = require("../botconfig.json")

// start the node module.
module.exports.run = async (bot, message, args) => {
  //Finds the value for the new prefix
  newPre = args.slice(0).join(' ')
  // Checks if the user set the prefix
  if(!newPre) {message.reply("Please specify a new prefix"); return;}
  //Sets the new prefix
  config.prefix = newPre;
  message.reply("Your prefix has changed!")
}
module.exports.help = {
  name: "setPrefix"
}
