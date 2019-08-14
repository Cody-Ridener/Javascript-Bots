// Last Edited 8/1/19
// Written by Cody Ridener
// Name: Index.js
// Main file for running all the commands given to the bot. With more apples


// Constants to be used in the code.
const {Pool, Client} = require('pg');
const pool = new Pool({
  user: 'yona',
  host: 'localhost',
  database: 'postgres',
  password: 'saintyona',
  port: 5432,
});
const botconfig = require("../botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone:true})
const mkTables = require('./commands/helpers/makeTables');
const fs = require('fs');
const gDB = require('./commands/helpers/generateDB');
// A collection for storing all of the commands.
bot.commands = new Discord.Collection();


// Imports all of the commands from the commands directory.
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

// The main methods for the bot.
bot.on("ready", async()=>{
  console.log(`${bot.user.username} is online!`)
  guilds = bot.guilds.array();
  guilds.forEach(function(guild){
    gDB.run(guild,pool);
    var db = new Pool({
    user: 'yona',
    host: 'localhost',
    database: guild.id.toString().toLowerCase(),
    password: 'saintyona'
  });
    mkTables.run(db);
  })


});
bot.on("guildCreate", guild => {
    gDB.run(guild, pool)
    var db = new Pool({
    user: 'yona',
    host: 'localhost',
    database: guild_name.toLowerCase(),
    password: 'saintyona'
    })
    mkTables.run(db);
  });

bot.on("message", async message =>{
  // Ignores any messages sent by the bot
  var server

  guild_name = message.guild.id.toString();

  server = new Pool({
  user: 'yona',
  host: 'localhost',
  database: guild_name.toLowerCase(),
  password: 'saintyona'
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
    bot.commands.get('writeContents').run(bot,message,args, server, false);
  }
})
bot.on("messageUpdate", async (message, update) =>{
  if(message.author.bot) return;
  if(message.channel.type == "dm") return;
  var server

  guild_name = message.guild.id.toString();
  server = new Pool({
  user: 'yona',
  host: 'localhost',
  database: guild_name.toLowerCase(),
  password: 'saintyona'
})
let messageArray = message.content.split(" ");
let args = messageArray.slice(1);
bot.commands.get('writeContents').run(bot,update,args,server,true);
});
// Logs the bot in.
bot.login(botconfig.token);
