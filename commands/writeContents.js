// Written on 8/1/2019
// Written by Cody Ridener
// Takes all non-command message data and stores it in a postgres server.
module.exports.run = async (bot, message, args,pool, update) => {
  // If there are any message embeds then the program will check how many embed there are
  if(message.embeds){
    // Checks the number of embeds
    var numEmbeds  = message.embeds.length;
    // A for loop to make a string that gives the name of the provider for all embeds in the message. These values can be YouTube Imgur etc
    var embedProviders = "";
    for( var i = 0; i<message.embeds.length; i++){
      if(i == message.embeds.length-1){
        embedProviders = embedProviders + message.embeds[i].provider.name;
      }
      else{
      embedProviders = embedProviders + message.embeds[i].provider.name + ',';
      }
    }
    // If there were no providers use the default value of none Available
    if(embedProviders == ''){
      embedProviders = "None Available"
    }
  }
  else{
    var numEmbeds = 0;
    var embedProviders = 'none';
  }
  // Collects the user's data that will be inputted into the postgres database.
  var data =
    [
      message.id,message.author.id, message.author.username,message.createdAt.getYear(),message.createdAt.getMonth(), message.createdAt.getDay(),
      message.createdAt.getDate(), message.createdAt.getHours(), message.channel.name, message.content, numEmbeds, embedProviders
    ];
    // A query using nose pg that will insert the data into the postgres database that the bot is connected to.
    // The first query attempts to create the users table in the given database, then if that resolves, or fails the bot will
    // then input the data into the database.

    //This section also handles information on message updates.
    if(update){
      pool.query("UPDATE users SET content = $1, embeds = $2, embedproviders = $3 WHERE messageID IN($4)",[message.content, numEmbeds, embedProviders, message.id], (err,res) => {
        if(err){
          console.log('Ooops we ran into an error when updating the message.')
          console.log(err)
        }else{
          console.log('message updated')
          console.log(message.content)
        }
      })
    }else{
    pool.query("CREATE TABLE users(messageID varchar(80),userID varchar(80), name varchar(80),year int, month int, weekday int, date int, hour int, channel varchar(80), content text, embeds int, embedProviders text)", (err,res) =>{
      pool.query("INSERT INTO users(messageID,userID, name,year, month, weekday, date, hour, channel, content, embeds, embedproviders) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)", data, (err, res) =>{
        if(err){
          console.log('Something went wrong while inserting data into ' + message.guild.name + 's database.')
        }
        else{
          console.log('successfully logged info into ' + message.guild.name);
        }
      });

    })
  }


}


// Sets the name for the file to help index.js find the command.
module.exports.help = {
  name:'writeContents'
}
