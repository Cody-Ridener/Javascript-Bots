// Written by Cody Ridener
// Written on 8/13/19
// Uses SQL queries to generate a database with the given name.
module.exports.run = async (guild, pool) => {
  guild_name = guild.id;
  pool.query(`CREATE DATABASE "${guild_name}"`, (err,res) => {
    if(err){
      console.log(guild_name+ " already exists")

    }else{
      console.log(guild_name+ " successfully created")
    }
  });
}
