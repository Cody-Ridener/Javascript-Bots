// For the purpose of saving user submissions and sending them to
// a local directory.
// Created by: Cody Ridener
// Created on: 10/5/2019
module.exports.run = async (bot, message,) => {
  const fs = require('fs');
  const eventChannels = require('../data/eventChannel.json');
  const images = './images/';
  message.attachments.forEach(a => fs.writeFileSync(`${images}${a.filename}`,a.url));
  message.channel.send("Hello There!");
}


module.exports.help =
{
  name: 'eventSubmission'
}
