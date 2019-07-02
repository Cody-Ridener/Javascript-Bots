const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone:true})
const fs = require("fs")
var Promise = require('bluebird');
bot.commands = new Discord.Collection();
fs.readdir("./commands/", (err,files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile <= 0){
    console.log("Couldn't find commands.");
  }

  jsfile.forEach((f,i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async()=>{
  console.log(`${bot.user.username} is online!`)
  bot.user.setGame("Cuckvania");
})
bot.on("message", async message =>{
  if(message.author.bot) return;
  if(message.channel.type == "dm") return;

  let prefix = botconfig.prefix;
  // Splits the message into different parts.
  let messageArray = message.content.split(" ");
  // Gets the first part of the message.
  let cmd  = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);
})
bot.login(botconfig.token);
