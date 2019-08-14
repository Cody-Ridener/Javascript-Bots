// Created by Cody Ridener
// Created on 8/13/19
// A class for generating SQL tables in a newly created database.

module.exports.run = async (db) => {
  db.query(`CREATE TABLE users(messageID varchar(80),userID varchar(80),name varchar(80),date varchar(80),channelID varchar(80), channel varchar(80),content text, embeds int, embedProviders text)`, (err,res) =>{
    if(err){
      console.log('users table already exists');
      console.log(err);
    }
  });
  db.query(`CREATE TABLE embeds(userID varchar(80), height int, width int, content text, date varchar(80),numEmbeds int, urls text[], paths text[] )`, (err,res) => {
    if(err){
      console.log('embeds table already exists');
      console.log(err)
    }
  });
}
