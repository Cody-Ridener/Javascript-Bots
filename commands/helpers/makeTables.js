// Created by Cody Ridener
// Created on 8/13/19
// A class for generating SQL tables in a newly created database.

module.exports.run = async (db) => {
  // Creates a users table that will store all messages sent by users in a server

  db.query(`CREATE TABLE users(messageID varchar(80),userID varchar(80),name varchar(80),date varchar(80),channelID varchar(80), channel varchar(80),content text, embeds int, embedProviders text)`, (err,res) =>{
    if(err){
      console.log('users table already exists');

    }
  });
  // Creates an embeds table that will store embed information for message embeds
  // as well as any images, and image urls.
  db.query(`CREATE TABLE embeds(userID varchar(80), height int, width int, content text, date varchar(80),numEmbeds int, urls text[], paths text[] )`, (err,res) => {
    if(err){
      console.log('embeds table already exists');

    }
  });
  db.query(`create table commandTimer(userID varchar(80), command varchar(80), date varchar(80))`, (err,res) => {
    if(err){
      console.log('commandTimer already exists');
    }
  })
}
