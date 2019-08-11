// Last Edited 8/1/19
// Written by Cody Ridener
// Name: Index.js
// Main file for running all the commands given to the bot.


// Constants to be used in the code.
const {Pool, Client} = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '',
  port: 5432,
});
const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone:true})
const fs = require("fs")
var Promise = require('bluebird');
// A collection for storing all of the commands.
bot.commands = new Discord.Collection();
// Imports all of the commands from the commands file.
fs.readdir("./commands/", (err,files) => {
  // Gives and error if the program encounters a problem.
  if(err) console.log(err);
  // Get the list of all the files from the commands folder.
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  // Throws this if there are no commands.
  if(jsfile <= 0){
    console.log("Couldn't find commands.");
  }
  // Imports the whole list of commands to be used later on in the program.
  jsfile.forEach((f,i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});


bot.on("ready", async()=>{
  console.log(`${bot.user.username} is online!`)
  bot.user.setActivity("Cuckvania");
  guilds = bot.guilds.array();

  for(var i = 0; i<guilds.length;i++){
    guild_name_split = guilds[i].name.split(" ");
    guild_name = ""
    for(var j = 1; j<= guild_name_split.length; j++){
      if(j == guild_name_split.length){
        guild_name = guild_name+guild_name_split[j-1];
      }else{
        guild_name = guild_name+guild_name_split[j-1]+"_";
      }
    }
    pool.query("CREATE DATABASE " + guild_name, (err,res) => {
      if(err){
        console.log(guild_name+ " already exists")
      }else{
        console.log(guild_name+ " successfully created")
      }
    })
  }
})
bot.on("guildCreate", guild => {
  guild_name_split = guild.name.split(" ")
  guild_name = ""
  for(var j = 1; j<= guild_name_split.length; j++){
    if(j == guild_name_split.length){
      guild_name = guild_name+guild_name_split[j-1];
    }else{
      guild_name = guild_name+guild_name_split[j-1]+"_";
    }
  }
  pool.query("CREATE DATABASE " + guild_name, (err,res) => {
    if(err){
      console.log("There was a problem.")
    }else{
      console.log("Database generated")
    }
  })

})

bot.on("message", async message =>{
  // Ignores any messages sent by the bot
  var server
  guild_name_split = message.guild.name.split(" ")
  guild_name = ""
  for(var j = 1; j<= guild_name_split.length; j++){
    if(j == guild_name_split.length){
      guild_name = guild_name+guild_name_split[j-1];
    }else{
      guild_name = guild_name+guild_name_split[j-1]+"_";
    }
  }
  server = new Pool({
  user: 'Cody Ridener',
  host: 'localhost',
  database: guild_name.toLowerCase(),
  password: 'Subzero97!'
})


  if(message.author.bot) return;
  // Ignores all DM's
  if(message.channel.type == "dm") return;
  let prefix = botconfig.prefix;
  // Splits the message into different parts.
  let messageArray = message.content.split(" ");
  // Gets the first part of the message.
  let cmd  = messageArray[0];
  let args = messageArray.slice(1);
  //Cuts off the prefix and sends the command issued to the bot to be ran
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) {
    commandfile.run(bot,message,args)
  }
  else{
    bot.commands.get('writeContents').run(bot,message,args, server);
  }
})
bot.on("messageUpdate", async message =>{
  var server
  guild_name_split = message.guild.name.split(" ")
  guild_name = ""
  for(var j = 1; j<= guild_name_split.length; j++){
    if(j == guild_name_split.length){
      guild_name = guild_name+guild_name_split[j-1];
    }else{
      guild_name = guild_name+guild_name_split[j-1]+"_";
    }
  }
  server = new Pool({
  user: 'Cody Ridener',
  host: 'localhost',
  database: guild_name.toLowerCase(),
  password: 'Subzero97!'
})
});
// Logs the bot in.
bot.login(botconfig.token);
