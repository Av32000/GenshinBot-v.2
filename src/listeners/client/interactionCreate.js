const { Listener } = require('discord-akairo');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { MongoClient } = require("mongodb");
const fonctions = require('../../util/functions')
const { duelUser, completeTeam, userInDuel, duels, owners, MONGOSTRING } = require('../../util/config')

class InteractionListener extends Listener {
  constructor() {
    super('interactionCreate', {
      emitter: 'client',
      event: 'interactionCreate'
    });
  }

  async exec(interaction) {
    let today = new Date();
    let id;
    let func = new fonctions
    if (interaction.isButton()) {
      //#region Debug
      if (interaction.customId == "close") {
        if (!owners.includes(interaction.user.id)) {
          return interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("#ff0000")
                .setDescription(`Tu n'as pas la permission de faire ça...`)
            ]
          })
        }
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(`Le ticket sera supprimé dans quelques secondes...`)
          ]
        })
        setTimeout(() => interaction.message.channel.delete(), 3000)
      }
      //#endregion

      //#region Duel
      if (interaction.customId == "AcceptDuel") {
        if (interaction.user.id == interaction.message.mentions.users.first().id) {
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("#3dfc03")
                .setDescription(`${interaction.user} à accepté le duel ✅`)
            ]
          })
          let message = interaction.message.toString()
          let authorID = message.split("/ ")[1].split(" :")[0]
          let mise = message.split(': ')[1]
          userInDuel.push(interaction.user.id)
          userInDuel.push(this.client.users.cache.find(user => user.id === authorID).id)
          duels.push(`${this.client.users.cache.find(user => user.id === authorID).id}/${interaction.user.id}:${mise}`)
          duels.push(`${interaction.user.id}/${this.client.users.cache.find(user => user.id === authorID).id}:${mise}`)
          func.sendEmbedChoice(interaction.user, 5)
          func.sendEmbedChoice(this.client.users.cache.find(user => user.id === authorID), 5)
          return interaction.message.delete();
        }
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ff1100")
              .setDescription(`Ce n'est pas à vous de choisir`)
          ]
        })
      }
      if (interaction.customId == "RefuserDuel") {
        if (interaction.user.id == interaction.message.mentions.users.first().id) {
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setColor("#ff1100")
                .setDescription(`${interaction.user} à refusé le duel 😕`)
            ]
          })
          return interaction.message.delete();
        }
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ff1100")
              .setDescription(`Ce n'est pas à vous de choisir`)
          ]
        })
      }

      if (interaction.customId == "valideTeam") {
        for (let i = 0; i < duelUser.length; i++) {
          let element = "" + duelUser[i]

          if (element.split(':[')[0] == interaction.user.tag) {
            let allSelected = []
            let team = []
            allSelected = element.split(':[')[1].split(']')[0].split(',')
            allSelected.forEach(element => {
              if (!team.includes(element)) {
                team.push(element)
              }
            })
            completeTeam.push(interaction.user.tag + ":[" + team.toString() + "]")
            console.log(completeTeam)
            const embed = new MessageEmbed()
              .setTitle("Equipe validée !")
              .setDescription("Ton équipe est prête. Tape /startDuel sur le serveur pour commencer le combat.")

            interaction.reply({
              embeds: [embed]
            })
            interaction.message.delete()
          }
        }

      }
      if (interaction.customId == "deleteTeam") {
        for (let i = 0; i < duelUser.length; i++) {
          let element = "" + duelUser[i]
          if (element.split(':[')[0] == interaction.user.tag) {
            duelUser.splice(i, 1)
          }
        }
        func.sendEmbedChoice(interaction.user, 5)
        interaction.message.delete()
        console.log(duelUser)
      }
      //#endregion
    }
    if (interaction.isSelectMenu()) {
      //#region Suport
      let tag = interaction.user.tag
      if (interaction.values[0] == "bug") {
        let patern = `bug-${tag.split("#")[1]}`
        await interaction.guild.channels.create(`bug ${tag.split("#")[1]}`)
        await interaction.guild.channels.cache.forEach(element => {
          if (element.name == patern.toLowerCase()) {
            id = element.id
            interaction.client.channels.cache.get(id).permissionOverwrites.create(
              interaction.guild.roles.everyone,
              {
                'VIEW_CHANNEL': false,
              }
            )
            interaction.client.channels.cache.get(id).permissionOverwrites.create(
              interaction.member.user,
              {
                'VIEW_CHANNEL': true,
              }
            )
            interaction.client.channels.cache.get(id).send({
              embeds: [
                new MessageEmbed()
                  .setColor("#ff8c00")
                  .setTitle(`Bug Report`)
                  .setDescription(`Merci de participer à la création de ce bot. Afin de rendre la résolution du bug la plus rapide possible merci de suivre ces étapes`)
                  .addField("Nom du bug", "Donne le nom du bug")
                  .addField("Description", "Elle dois être la plus précise possible.")
                  .addField("Exemple", "Si possible montre un screen, un lien ou un rec du bug")
              ]
            })
            interaction.client.channels.cache.get(id).send(`${interaction.member.user}`)
          }
        });

        return this.client.users.cache.find(user => user.id === '593436735380127770').send({
          embeds: [
            new MessageEmbed()
              .setColor("#e815d6")
              .setTitle("Nouveaux bug report")
              .setDescription(`Un bug a été report !`)
              .addField("User", `${interaction.member.user} (${interaction.member.user.id})`)
              .addField("Channel", `<#${id}>`)
              .addField("Date", `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} à ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`)
          ]
        })
      }
      if (interaction.values[0] == "pay") {
        let patern = `récompense-${tag.split("#")[1]}`
        await interaction.guild.channels.create(`récompense ${tag.split("#")[1]}`)

        await interaction.guild.channels.cache.forEach(element => {
          if (element.name == patern.toLowerCase()) {
            id = element.id
            interaction.client.channels.cache.get(id).permissionOverwrites.create(
              interaction.guild.roles.everyone,
              {
                'VIEW_CHANNEL': false,
              }
            )
            interaction.client.channels.cache.get(id).permissionOverwrites.create(
              interaction.member.user,
              {
                'VIEW_CHANNEL': true,
              }
            )
            interaction.client.channels.cache.get(id).send({
              embeds: [
                new MessageEmbed()
                  .setColor("#eff542")
                  .setTitle(`Réclamation Récompense`)
                  .setDescription(`Pour recevoir la récompense merci de suivre ces étapes`)
                  .addField("Raison", "Explique pourquoi dois tu etre récompenser")
                  .addField("Preuve", "Montre un screen, un lien ou un rec")
              ]
            })
            interaction.client.channels.cache.get(id).send(`${interaction.member.user}`)
          }
        });

        return this.client.users.cache.find(user => user.id === '593436735380127770').send({
          embeds: [
            new MessageEmbed()
              .setColor("#eff542")
              .setTitle("Nouveaux payement demandé")
              .setDescription(`Un payment a été demandé !`)
              .addField("User", `${interaction.member.user} (${interaction.member.user.id})`)
              .addField("Channel", `<#${id}>`)
              .addField("Date", `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} à ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`)
          ]
        })
      }
      if (interaction.values[0] == "ban") {
        let patern = `sigalement-${tag.split("#")[1]}`
        await interaction.guild.channels.create(`sigalement ${tag.split("#")[1]}`)

        await interaction.guild.channels.cache.forEach(element => {
          if (element.name == patern.toLowerCase()) {
            id = element.id
            interaction.client.channels.cache.get(id).permissionOverwrites.create(
              interaction.guild.roles.everyone,
              {
                'VIEW_CHANNEL': false,
              }
            )
            interaction.client.channels.cache.get(id).permissionOverwrites.create(
              interaction.member.user,
              {
                'VIEW_CHANNEL': true,
              }
            )
            interaction.client.channels.cache.get(id).send({
              embeds: [
                new MessageEmbed()
                  .setColor("#ff0000")
                  .setTitle(`Signaler un membre`)
                  .setDescription(`Merci de participer à la bonne entente dans ce serveur. Pour que le signalement aboutisse merci de suivre ces étapes`)
                  .addField("Membre", "Quel membre dois être sanctionner")
                  .addField("Raison", "Explique le problème")
                  .addField("Preuve", "Montre un screen, un lien ou un rec")
              ]
            })
            interaction.client.channels.cache.get(id).send(`${interaction.member.user}`)
          }
        });

        return this.client.users.cache.find(user => user.id === '593436735380127770').send({
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setTitle("Nouveaux Signalement")
              .setDescription(`Un siganlement a été éffectué !`)
              .addField("User", `${interaction.member.user} (${interaction.member.user.id})`)
              .addField("Channel", `<#${id}>`)
              .addField("Date", `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} à ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`)
          ]
        })
      }
      if (interaction.values[0] == "q") {
        let patern = `question-${tag.split("#")[1]}`
        await interaction.guild.channels.create(`question ${tag.split("#")[1]}`)

        await interaction.guild.channels.cache.forEach(element => {
          if (element.name == patern.toLowerCase()) {
            id = element.id
            interaction.client.channels.cache.get(id).permissionOverwrites.create(
              interaction.guild.roles.everyone,
              {
                'VIEW_CHANNEL': false,
              }
            )
            interaction.client.channels.cache.get(id).permissionOverwrites.create(
              interaction.member.user,
              {
                'VIEW_CHANNEL': true,
              }
            )
            interaction.client.channels.cache.get(id).send({
              embeds: [
                new MessageEmbed()
                  .setColor("#5c5b5b")
                  .setTitle(`Poser une question / Faire une sugestion`)
                  .setDescription(`Merci de participer à l'amélioration de ce serveur. Merci de suivre ces étapes`)
                  .addField("Nom", "Donne un nom a ta sugestion/ta question")
                  .addField("Description", "Pose ta question / Explique ta sugestion")
              ]
            })
            interaction.client.channels.cache.get(id).send(`${interaction.member.user}`)
          }
        });

        return this.client.users.cache.find(user => user.id === '593436735380127770').send({
          embeds: [
            new MessageEmbed()
              .setColor("#5c5b5b")
              .setTitle("Nouvelle question / Sugestion")
              .setDescription(`Une question a été poser ! Ou une sugestion...`)
              .addField("User", `${interaction.member.user} (${interaction.member.user.id})`)
              .addField("Channel", `<#${id}>`)
              .addField("Date", `${today.getDate()}/${today.getMonth()}/${today.getFullYear()} à ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`)
          ]
        })
      }
      //#endregion

      //#region Duel Setup
      let interactionValue = "" + interaction.values[0]
      if (interactionValue.split(":")[0] === "Perssonage Adversse") {
        let interactionMessage = "" + interaction.message.toString()
        let number = parseInt(interactionMessage.toString())

        //Save du choix
        if (number == 5) {
          duelUser.push(`${interaction.user.tag}:[${interactionValue.split(":")[1]}`)
        } else if (number == 1) {
          for (let i = 0; i < duelUser.length; i++) {
            let element = "" + duelUser[i]
            if (element.split(':[')[0] == interaction.user.tag) {
              duelUser.splice(i, 1)
              duelUser.push(`${interaction.user.tag}:[${element.split(':[')[1]},${interactionValue.split(":")[1]}]`)
            }
          }
        } else {
          for (let i = 0; i < duelUser.length; i++) {
            let element = "" + duelUser[i]
            if (element.split(':[')[0] == interaction.user.tag) {
              duelUser.splice(i, 1)
              duelUser.push(`${interaction.user.tag}:[${element.split(':[')[1]},${interactionValue.split(":")[1]}`)
            }
          }
        }

        interaction.message.delete()

        if (number - 1 != 0) {
          func.sendEmbedChoice(interaction.user, number - 1)
        }
        else {
          let team = [];
          for (let i = 0; i < duelUser.length; i++) {
            let element = "" + duelUser[i]
            if (element.split(':[')[0] == interaction.user.tag) {
              let allSelected = []
              allSelected = element.split(':[')[1].split(']')[0].split(',')
              allSelected.forEach(element => {
                if (!team.includes(element)) {
                  team.push(element)
                }
              })
            }
          }
          let recapEmbed = new MessageEmbed()
            .setColor("#06087a")
            .setTitle(`Préparation au duel`)

          team.forEach(element => {
            recapEmbed.addField(`${element}`, `${element}`)
          })

          const confirm = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('valideTeam')
                .setEmoji('✔️')
                .setLabel("Confirmer !")
                .setStyle("SUCCESS")
            )

          const stop = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('deleteTeam')
                .setEmoji('❌')
                .setLabel("Refuser !")
                .setStyle('DANGER')
            )

          interaction.user.send({
            embeds: [recapEmbed],
            components: [confirm, stop]
          })
        }
      }
      //#endregion
    }
    if (interaction.isCommand()) {
      const { commandName, options } = interaction

      //#region VerifMaintenance

      let commandsblacklist = [];
      const uri = MONGOSTRING;
      const client = new MongoClient(uri);

      try {
        await client.connect();
        const database = client.db("BlackLists");

        const items = await database.collection('commands').find({}).toArray();
        //Ajout des users a l'array
        items.forEach(element => {
          commandsblacklist.push(element.title)
        });
      } finally {
        await client.close();
      }

      if (commandsblacklist.includes(commandName)) {
        interaction.reply({
          content: "Cette commande est en maintenance :(",
          ephemeral: true
        })
        return;
      }
      //#endregion

      //#region VerifBlackList
      let userblacklist = [];
      try {
        await client.connect();
        const database = client.db("BlackLists");

        const items = await database.collection('users').find({}).toArray();
        //Ajout des users a l'array
        items.forEach(element => {
          userblacklist.push(element.content)
        });
      } finally {
        await client.close();
      }
      if (userblacklist.includes(interaction.user.id)) {
        interaction.reply({
          content: "Vous etes BlackLister :(",
          ephemeral: true
        })
        return;
      }
      //#endregion

      if (commandName == "ping") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/ping')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "reload") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/restart')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "test") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/test')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "add_owner") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/addOwner')
        let instance = new file
        instance.exec(interaction, options.getUser('user'));
      } else if (commandName == "remove_owner") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/removeOwner')
        let instance = new file
        instance.exec(interaction, options.getUser('user'));
      } else if (commandName == "setup") {
        let file = require('../../slashCommands/misc/setup')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "chart") {
        let file = require('../../slashCommands/coins/chart')
        let instance = new file
        instance.exec(interaction, interaction.client);
      } else if (commandName == "set_coins") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/coins/setCoins')
        let instance = new file
        instance.exec(interaction, options.getUser('user'), options.getNumber('value'));
      } else if (commandName == "add_coins") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/coins/addCoins')
        let instance = new file
        instance.exec(interaction, options.getUser('user'), options.getNumber('value'));
      } else if (commandName == "remove_coins") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/coins/removeCoins')
        let instance = new file
        instance.exec(interaction, options.getUser('user'), options.getNumber('value'));
      } else if (commandName == "coins") {
        let file = require('../../slashCommands/coins/coins')
        let instance = new file
        instance.exec(interaction, options.getUser('user'));
      } else if (commandName == "invoc") {
        let file = require('../../slashCommands/Invoc/invoc')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "invoc_premium") {
        let file = require('../../slashCommands/Invoc/invocPremium')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "patch_note") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/misc/patchNotes')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "triggered") {
        let file = require('../../slashCommands/misc/triggered')
        let instance = new file
        instance.exec(interaction, options.getString('prof'));
      } else if (commandName == "support") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/misc/support')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "say") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/misc/say')
        let instance = new file
        instance.exec(interaction, options.getString('message'));
      } else if (commandName == "userinfo") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/misc/userinfo')
        let instance = new file
        instance.exec(interaction, options.getUser('user'));
      } else if (commandName == "mp") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/mpTo')
        let instance = new file
        instance.exec(interaction, options.getUser('user'), options.getString('message'));
      } else if (commandName == "version") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/version')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "eval") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/eval')
        let instance = new file
        instance.exec(interaction, options.getString('code'));
      } else if (commandName == "log") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/log')
        let instance = new file
        instance.exec(interaction, options.getUser('user'), options.getString('message'));
      } else if (commandName == "close") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/close')
        let instance = new file
        instance.exec(interaction);
      } else if (commandName == "set_maintenance") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/setMaintenance')
        let instance = new file
        instance.exec(interaction, options.getString('command'), options.getString('reason'));
      } else if (commandName == "set_active") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/setActive')
        let instance = new file
        instance.exec(interaction, options.getString('command'));
      }else if (commandName == "maintenance_list") {
        let file = require('../../slashCommands/Dev/maintenanceList')
        let instance = new file
        instance.exec(interaction, options.getString('command'));
      }else if (commandName == "blacklist") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/addBlacklist')
        let instance = new file
        instance.exec(interaction, options.getUser('user'));
      }else if (commandName == "unblacklist") {
        if (!owners.includes(interaction.user.id)) {
          interaction.reply({
            content: 'Cette commandes est "OwnerOnly" !',
            ephemeral: true
          })
          return;
        }
        let file = require('../../slashCommands/Dev/unBlacklist')
        let instance = new file
        instance.exec(interaction, options.getUser('user'));
      }else if (commandName == "daily") {
        let file = require('../../slashCommands/Games/daily')
        let instance = new file
        instance.exec(interaction);
      }else if (commandName == "rpc") {
        let file = require('../../slashCommands/Games/rpc')
        let instance = new file
        instance.exec(interaction, options.getString('type'), options.getNumber('value'));
      }else if (commandName == "roulette") {
        let file = require('../../slashCommands/Games/roulette')
        let instance = new file
        instance.exec(interaction, options.getString('type'), options.getNumber('value'));
      }
    }


  }
}

module.exports = InteractionListener;