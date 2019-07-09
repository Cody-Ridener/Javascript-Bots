// Last Edited 7/2/2019
// Written by: Cody Ridener
// The purpose of this command it to assign a role to the given user.
// Takes a user and a role and assigns the role to the user.

// Requires the discord.js library.
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  // Checks if the user sending the command has the manage_roles permissions.
  if(message.channel.permissionsFor(message.member).has("MANAGE_ROLES", false)){
    // finds if the user gave a user and a role then gives that role to the indicated user, assuming the role
    // and user exist. 
    var user = message.mentions.members.first();
    var role = message.guild.roles.find(role => role.name === args.slice(1).join(' '));
    if(!role){message.reply("Role not Found"); return;};
    if(!user){message.reply("Please include a user"); return;};
    user.addRole(role).catch(console.error);
  }
}
module.exports.help = {
  name: "giveRole"
}
