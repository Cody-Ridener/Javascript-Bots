// Created by: Cody Ridener
// Created on: 10/5/19
// Sets event channels for an ongoing event.

module.exports.run = async (bot, message, args,server) => {
  // Imports two files that can be used to check for trusted users, as well as
  // add event channels.
  const fs = require('fs');
  const trustedRoles = require("../data/trustedRoles.json");
  const eventChannels = require("../data/watchedChannels.json");
  // Instantiates a trustedUser variable that will determine if the user
  // is qualified to change the event channel.
  member = message.guild.members.get(message.author.id);
  var trustedUser = false;
  // Varifies if the user is trusted.
  if(member.hasPermission("ADMINISTRATOR",false,true,true)){
    trustedUser = true;
  }
  Array.from(member.roles).forEach(a => {
    if(trustedRoles.roles.includes(a[0])){
      trustedUser = true;
    }})
  if(trustedUser){
    var messageArray = message.content.split(",");
    if(messageArray.length != 2) {
      message.reply("That's not the right amount of arguments. Try again!");
      return;
    }
    var post = messageArray[0].slice(2,messageArray[0].length-1);
    var record = messageArray[1].slice(2,messageArray[1].length-1);
    messageArray = [messageArray[0].split(" ")[1].replace(/\s/g,''),messageArray[1].replace(/\s/g,'')];
    var post = messageArray[0].slice(2,messageArray[0].length-1);
    var record = messageArray[1].slice(2,messageArray[1].length-1);
    var pChan = message.guild.channels.get(post);
    var rChan = message.guild.channels.get(record);
    if(pChan == undefined|| rChan == undefined){
      message.reply("Ooops one of those isn't quite right. Try again and make sure to use #channelname this time!");
      return;
    }
    if(pChan.type != 'text' || rChan.type != 'text'){
      message.reply("Fuck you Ayvcel");
      return;
    }

    if(post == record){
      message.reply("Please specify different channels");
      return;
    }
    var data =
    {
      Postchannel: post,
      RecordingChannel: record
    }
    fs.writeFile('./data/eventChannel.json', JSON.stringify(data), (err) => {
      if(err){
      console.log(err)
    }
    else{
      message.reply(`${pChan.name} is the channel people will post in, and I will repost their submissions into ${rChan.name}`)
    }
    })
 }

}


module.exports.help = {
  name : "setEventChannels"
}
