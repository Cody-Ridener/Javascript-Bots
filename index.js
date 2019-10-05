// Last Edited 8/13/19
// Written by Cody Ridener
// Name: Index.js
// Main file for running all the commands given to the bot. With more apples

//////////////////////////////////////////////////////////
// Constants to be used in the code.
const {Pool, Client} = require('pg');
const pool = new Pool({
  user: 'yona',
  host: 'localhost',
  database: 'postgres',
  password: 'saintyona',
  port: 5432,
});
const watchedChannels = require("./data/watchedChannels.json");
const watchedMessages = require("./data/watchedMessages.json");
const botconfig = require("./data/botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone:true})
const mkTables = require('./commands/helpers/makeTables');
const fs = require('fs');
const gDB = require('./commands/helpers/generateDB');
//////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
// The main methods for the bot
// Creates databases when the bot logs on, if the databases already exist the
// code will just move on. Also initializes all tables to be used in the
// databases.
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
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
// If the active bot is added to another server it will immediately create a new
// database with the appropriate tables for the server.
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
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
// A message handler for the bot. Scans messages and determines which commands
// to use based on the message content.
bot.on("message", async message =>{
  // Checks if the bot is messaging in an accepted channel.
  var acceptCommand = false;
  if (watchedChannels.channels.length == 0) acceptCommand = true;
  else if (watchedChannels.channels.includes(message.channel)) {
    acceptCommand = true
  }
  else acceptCommand = false;
  // Instantiates a postgres Server instance.
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
  //makes a list of all mentioned users.
  var mentioned = Array.from(message.mentions.users);
  // A variable to check if the bot was mentioned
  var botMentioned = false;
  // Sets bot mentioned to true if the bot was mentioned.
  mentioned.forEach(a => {if (a[0] == '594462181014110209') botMentioned = true;})
  //checks if the message mentioned the bot
  if(botMentioned & acceptCommand) bot.commands.get('eventSubmission').run(bot, message);
  let prefix = botconfig.prefix;
  // Splits the message into different parts.
  let messageArray = message.content.split(" ");
  // Gets the first part of the message.
  let cmd  = messageArray[0];
  let args = messageArray.slice(1);
  //Cuts off the prefix and sends the command issued to the bot to be ran
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile & acceptCommand) {
    commandfile.run(bot,message,args,server)
  }
  else{
    bot.commands.get('writeContents').run(bot,message,args, server, false);
  }
})
//////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////
// When a message update is made a log is made in the database to reflect that.
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
//////////////////////////////////////////////////////////


// Logs the bot in.
bot.login(botconfig.token);
