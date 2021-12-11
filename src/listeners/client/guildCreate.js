const { Listener } = require('discord-akairo');
const {Guild} = require("../../structures/Models");

class GuildCreateListener extends Listener {
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    async exec(guild) {
      await Guild.create({id: guild.id}, err => {
        if(err) return console.log("Erreur !");
        console.log(`Nouveau serveur rejoint : ${guild.name}(${guild.id})`);
      })        
    }
}

module.exports = GuildCreateListener;