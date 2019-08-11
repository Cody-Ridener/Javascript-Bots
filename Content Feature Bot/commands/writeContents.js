// Written on 8/1/2019
// Written by Cody Ridener
// Takes all non-command message data and stores it in a .csv file.
module.exports.run = async (bot, message, args,pool) => {


  if(message.embeds){
    var numEmbeds  = message.embeds.length;
    var embedProviders = "";
    for( var i = 0; i<message.embeds.length; i++){
      if(i == message.embeds.length-1){
        embedProviders = embedProviders + message.embeds[i].provider.name;
      }
      else{
      embedProviders = embedProviders + message.embeds[i].provider.name + ',';
      }
    }
    if(embedProviders == ''){
      embedProviders = "None Available"
    }
  }
  else{
    var numEmbeds = 0;
    var embedProviders = 'none';
  }
  var data =
    [
      message.id, message.author.username,message.createdAt.getYear(),message.createdAt.getMonth(), message.createdAt.getDay(),
      message.createdAt.getDate(), message.createdAt.getHours(), message.channel.name, message.content, numEmbeds, embedProviders
    ];
    pool.query("CREATE TABLE users(messageID varchar(80), name varchar(80),year int, month int, weekday int, date int, hour int, channel varchar(80), content text, embeds int, embedProviders text)", (err,res) =>{
      pool.query("INSERT INTO users(messageID, name,year, month, weekday, date, hour, channel, content, embeds, embedproviders) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11)", data, (err, res) =>{
        console.log(err,res);
      });

    })

  console.log("Data was written");
}


// Sets the name for the file to help index.js find the command.
module.exports.help = {
  name:'writeContents'
}
