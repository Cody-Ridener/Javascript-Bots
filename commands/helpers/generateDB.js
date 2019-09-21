// Written by Cody Ridener
// Written on 8/13/19
// Uses SQL queries to generate a database with the given name.
module.exports.run = async (guild, pool) => {
  // Sets the name of the guild to the guild unique ID
  guild_name = guild.id;
  // Creates a database based on the guild's ID rather than the guilds Name
  // because ID's are imutable and the guild name is not. 
  pool.query(`CREATE DATABASE "${guild_name}"`, (err,res) => {
    if(err){
      console.log(guild_name+ " already exists")

    }else{
      console.log(guild_name+ " successfully created")
    }
  });
}
