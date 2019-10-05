// Written by Cody Ridener
// Last Edited 8/18/2019
// Used for the purpose of generating detailed server statistics. The user will
// Have the ability to decide what information they want and what to compare it
// against.
// Imports a list of messages that the bot will be watching for reaction events.

module.exports.run = async (bot,message,args,server) => {

  var res = await server.query('SELECT * FROM users')
  console.log(res)
  console.log(res.rows[1].messageid)
  var messageIDs =''
  for(var i = 0; i < res.rows.length;i++){
    messageIDs = messageIDs + res.rows[i].messageid.toString() + '\n';
  }
  message.reply(messageIDs);
}
module.exports.help =
{
  name: 'serverStats'
}
