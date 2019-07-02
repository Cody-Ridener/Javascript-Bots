const Discord = require("discord.js")

module.exports.run = async (bot, message,args) => {
  return message.channel.send("We did it boys.");
}

module.exports.help = {
  name: "hello"
}
