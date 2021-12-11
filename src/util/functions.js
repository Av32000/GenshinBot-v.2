const{MessageActionRow, MessageSelectMenu, MessageEmbed} = require('discord.js');
const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('./config'); 

class functions{
  async sendEmbedChoice(user, number) {
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);

    //#region Setup Adverssaire
    let team = [''];
    let elements = [];
    try {
      await client.connect();
      const database = client.db("Perso");
      const items = await database.collection('Persos').find({}).toArray();
      let names = ""
      let typess = ""
      let atts = ""
      let defs = ""
      items.forEach(element => {
        if(element.user == user.id){
          names = names + " " + element.name
          typess = typess + " " + element.type
          atts = atts + " " + element.att
          defs = defs + " " + element.def
        }
      });
      
      //#region names
      let persosAll = names.split(' ')
      let persos = [""]
      persosAll.forEach(element => {
        if(!persos.includes(element)){
          persos.push(element)
        }
      });
      //#endregion

      //#region type
      let typesAll = typess.split(' ')
      let types = [""]
      typesAll.forEach(element => {
        switch (element){
          case "Pyro" :
            types.push("🔥");
            break;
          case "Geo":
            types.push("🗻");
            break;
          case "Cryo":
            types.push("❄️");
            break;
          case "Electro":
            types.push("⚡");
            break;
          case "Anemo":
            types.push("🌪️");
            break;
          case "Hydro":
            types.push("💧");
            break;
          default:
            types.push("❌");
        }   
      });
      //#endregion

      //#region Att
      let attAll = atts.split(' ')
      let att = [""]
      attAll.forEach(element => {
        att.push(element)
      });
      //#endregion

      //#region Def
      let defAll = defs.split(' ')
      let def = [""]
      defAll.forEach(element => {
        def.push(element)
      });
      //#endregion
      
      for(let i = 0; i <= persos.length;i++){
        if(persos[i] != "" && persos[i] != undefined){
          elements.push(
            {
              label: `${persos[i]}`,
              value: `Perssonage Adversse:${persos[i]}`,
              description: `Att : ${att[i + 1]} || Def : ${def[i + 1]}`,
              emoji: `${types[i + 1]}`
            }
          )
        }
      }
    } finally {
      await client.close();
    }
    //#region Selector
    const Selector1 = new MessageActionRow().addComponents(new MessageSelectMenu()
      .setCustomId('adverse1')
      .setPlaceholder("Choisissez un perssonage")
      .addOptions(elements)
    )
    const Selector2 = new MessageActionRow().addComponents(new MessageSelectMenu()
      .setCustomId('adverse2')
      .setPlaceholder("Choisissez un perssonage")
      .addOptions(elements)
    )
    const Selector3 = new MessageActionRow().addComponents(new MessageSelectMenu()
      .setCustomId('adverse3')
      .setPlaceholder("Choisissez un perssonage")
      .addOptions(elements)
    )
    const Selector4 = new MessageActionRow().addComponents(new MessageSelectMenu()
      .setCustomId('adverse4')
      .setPlaceholder("Choisissez un perssonage")
      .addOptions(elements)
    )
    const Selector5 = new MessageActionRow().addComponents(new MessageSelectMenu()
      .setCustomId('adverse5')
      .setPlaceholder("Choisissez un perssonage")
      .addOptions(elements)
    )
    //#endregion
    //#endregion
    
    if(number == 5){
      user.send({
        content: "5",
        embeds: [
          new MessageEmbed()
          .setColor("#06087a")
          .setTitle(`Préparation au duel`)
          .addField(`Etape 1`, `Choisis 5 perssonages`)
        ],
        components: [Selector1,Selector2,Selector3,Selector4,Selector5]
      })
    }else if(number == 4){
      user.send({
        content: "4",
        embeds: [
          new MessageEmbed()
          .setColor("#06087a")
          .setTitle(`Préparation au duel`)
          .addField(`Etape 1`, `Choisis 5 perssonages`)
        ],
        components: [Selector1,Selector2,Selector3,Selector4]
      })
    }else if(number == 3){
      user.send({
        content: "3",
        embeds: [
          new MessageEmbed()
          .setColor("#06087a")
          .setTitle(`Préparation au duel`)
          .addField(`Etape 1`, `Choisis 5 perssonages`)
        ],
        components: [Selector1,Selector2,Selector3]
      })
    }else if(number == 2){
      user.send({
        content: "2",
        embeds: [
          new MessageEmbed()
          .setColor("#06087a")
          .setTitle(`Préparation au duel`)
          .addField(`Etape 1`, `Choisis 5 perssonages`)
        ],
        components: [Selector1,Selector2]
      })
    }else if(number == 1){
      user.send({
        content: "1",
        embeds: [
          new MessageEmbed()
          .setColor("#06087a")
          .setTitle(`Préparation au duel`)
          .addField(`Etape 1`, `Choisis 5 perssonages`)
        ],
        components: [Selector1]
      })
    }
  } 
  
  async boucleDeCombat(adverssaireID, userID, channel, mise){
    let adverssaire = channel.client.users.cache.find(user => user.id === adverssaireID)
    let user = channel.client.users.cache.find(user => user.id === userID)

    channel.send(`Duel de ${user} contre ${adverssaire} pour ${mise}`)

    
  }
}
module.exports = functions