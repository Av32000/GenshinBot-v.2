const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo');
const { MONGOSTRING } = require('../util/config');
const mongoose = require('mongoose');
module.exports = class GotoClient extends AkairoClient {

  constructor(config = {}) {
    super(
      { ownerID: '593436735380127770' },
      {
        allowedMentions: {
          parse: ['roles', 'users', 'everyone']
        },
        partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
        presence: {
          status: 'online',
          activities: [{
            name: 'son créateur',
            type: 'WATCHING'
          }]
        },
        intents: 32767
      }
    );

    this.commandHandler = new CommandHandler(this, {
      allowMention: true,
      prefix: config.prefix,
      defaultCooldown: 2000,
      directory: './src/commands/'
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: './src/listeners/'
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: './src/inhibitors/'
    });
  }

  init() {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler
    });
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.loadAll();
    console.log(`Commandes -> ${this.commandHandler.modules.size}`);
    this.listenerHandler.loadAll();
    console.log(`Listeners -> ${this.listenerHandler.modules.size}`);
    this.inhibitorHandler.loadAll();
    console.log(`Inhibitors -> ${this.inhibitorHandler.modules.size}`);
  }

  async start(TOKEN) {
    try {
      await mongoose.connect(MONGOSTRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      console.log("Connecter à la BDD");
    } catch (e) {
      console.log("Impossible de se connecter à la BDD\n\n", e);
      return process.exit();
    }

    await this.init();
    return this.login(TOKEN)
  }

}
