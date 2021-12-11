const { MongoClient } = require("mongodb");
const { MONGOSTRING, rpc } = require('../../util/config');
const { MessageEmbed } = require('discord.js')
const itemRandom = () => Math.floor(Math.random() * 3) + 1;


async function addCoins(Prix, user, interaction) {
  var current;

  const uri = MONGOSTRING;
  const client = new MongoClient(uri);


  const filter = { title: `${user.id}` };
  const options = { upsert: true };

  try {
    await client.connect();
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    const query = { title: `${user.id}` };

    const movie = await movies.findOne(query);
    if (movie == null) {
      interaction.reply(`${user} Merci de faire \`g/setup\` Avant d'utliser les commandes de ce serveur`)
      return;
    }
    current = movie.content;
    current = parseInt(current) + parseInt(Prix);
  } finally {
    await client.close();
  }

  try {

    await client.connect();
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    const updateDoc = {
      $set: {
        content: `${current}`
      },
    };
    const result = await movies.updateOne(filter, updateDoc, options);
    console.log(
      `${user.tag} gagne ${Prix} primos au rpc`,
    );
    interaction.followUp(`${user} a désormais : ${current} primo gemmes.`);
  } finally {
    await client.close();
  }
}
async function removeCoins(Prix, user, interaction) {
  var current;

  const uri = MONGOSTRING;
  const client = new MongoClient(uri);


  const filter = { title: `${user.id}` };
  const options = { upsert: true };

  try {
    await client.connect();
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    const query = { title: `${user.id}` };

    const movie = await movies.findOne(query);
    if (movie == null) {
      interaction.reply(`${user} Merci de faire \`g/setup\` Avant d'utliser les commandes de ce serveur`)
      return;
    }
    current = movie.content;
    current = parseInt(current) - parseInt(Prix);
  } finally {
    await client.close();
  }

  try {

    await client.connect();
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    const updateDoc = {
      $set: {
        content: `${current}`
      },
    };
    const result = await movies.updateOne(filter, updateDoc, options);
    console.log(
      `${user.tag} perds ${Prix} primos au rpc`,
    );
    interaction.followUp(`${user} a désormais : ${current} primo gemmes.`);
  } finally {
    await client.close();
  }
}

function egal(Joueur, interaction, client) {
  if (Joueur == "r") {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#d17f04")
          .setTitle(`Pierre 🪨 contre Pierre 🪨`)
          .setDescription(`Vous ne perdez et ne gagnez rien`)
      ]
    })
  } else if (Joueur == "p") {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#d17f04")
          .setTitle(`Papier 📜 contre Papier 📜`)
          .setDescription(`Vous ne perdez et ne gagnez rien`)
      ]
    })
  } else if (Joueur == "c") {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#d17f04")
          .setTitle(`Ciseaux ✂️ contre Ciseaux ✂️`)
          .setDescription(`Vous ne perdez et ne gagnez rien`)
      ]
    })
  }
}

function loose(Joueur, Prix, interaction, client) {
  if (Joueur == "r") {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#ff0000")
          .setTitle(`Pierre 🪨 contre Papier 📜`)
          .setDescription(`Vous perdez ${Prix} primos`)
      ]
    })
  } else if (Joueur == "p") {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#ff0000")
          .setTitle(`Papier 📜 contre Ciseaux ✂️`)
          .setDescription(`Vous perdez ${Prix} primos`)
      ]
    })
  } else if (Joueur == "c") {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#ff0000")
          .setTitle(`Ciseaux ✂️ contre Pierre 🪨`)
          .setDescription(`Vous perdez ${Prix} primos`)
      ]
    })
  }
  return removeCoins(Prix, interaction.user, interaction);
}

function win(Joueur, Prix, interaction, client) {
  if (Joueur == "r") {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#04d153")
          .setTitle(`Pierre 🪨 contre Ciseaux ✂️`)
          .setDescription(`Vous gagnez ${Prix} primos`)
      ]
    })
  } else if (Joueur == "p") {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#04d153")
          .setTitle(`Papier 📜 contre Pierre 🪨`)
          .setDescription(`Vous gagnez ${Prix} primos`)
      ]
    })
  } else if (Joueur == "c") {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("#04d153")
          .setTitle(`Ciseaux ✂️ contre Papier 📜`)
          .setDescription(`Vous gagnez ${Prix} primos`)
      ]
    })
  }
  return addCoins(Prix, interaction.user, interaction);
}

class Ping {
  async exec(interaction, type, value) {
    let item = ""
    let bot = ""
    let isNumber = false;

    //#region checkUser
    const uri = MONGOSTRING;
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const query = { title: `${interaction.user.id}` };

      const movie = await movies.findOne(query);
      if (movie == null) {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(`Merci de faire \`g/setup\` Avant d'utliser les commandes de ce serveur`)
          ],
          ephemeral: true
        })
      }
    } finally {
      await client.close();
    }
    //#endregion

    for (let i = 1; i <= 100; i++) {
      if (value == i) {
        isNumber = true;
        break;
      }
    }
    if (isNumber == false) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(`Merci de miser entre 1 et 100 primos`)
        ], ephemeral: true
      })
    }

    //#region checkCoins
    try {
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");

      const query = { title: `${interaction.user.id}` };

      const movie = await movies.findOne(query);
      if (movie == null) {
        interaction.reply({
          content: `Merci de faire \`g/setup\` Avant d'utliser les commandes de ce serveur`,
          ephemeral: true
        })
        return false;
      }
      if (movie.content < value) {
        return `${interaction.user} Merci de faire \`g/setup\` Avant d'utliser les commandes de ce serveur`({
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(`Vous n'avez pas assez de primos`)
          ]
        })
      }

    } finally {
      await client.close();
    }
    //#endregion
    if (type == "r" || type == "p" || type == "c") {
      let today = new Date();

      let userCooldowns = false;

      rpc.forEach(element => {
        if (element.split("=>")[0] == interaction.user.id) {

          if ((parseInt(element.split("=>")[1].split(" ")[1]) + 60000) > today.getTime()) {
            userCooldowns = true
          }
        }
      });
      if (userCooldowns == true) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#fc0320")
              .setTitle(`${interaction.username}`)
              .setDescription(`:x:  Merci d'attendre 1 minute entre chaque partie :x: `)
          ],
          ephemeral: true
        })
        return;
      }

      if (userCooldowns == false) {
        for (let i = 0; i < rpc.length; i++) {
          if (rpc[i].split("=>")[0] == interaction.user.id) {
            rpc[i].slice(i, 1)
            break;
          }
        }
      }
      rpc.push(interaction.user.id + "=> " + today.getTime())
    }
    if (type == "r") {
      item = "r"
    } else if (type == "p") {
      item = "p"
    } else if (type == "c") {
      item = "c"
    } else {
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(`Merci de jouer r(Rock), p(Paper) ou c(Scissor)`)
        ]
      })
      return;
    }
    if (itemRandom() == 1) {
      bot = "1"
    } else if (itemRandom() == 2) {
      bot = "2"
    } else if (itemRandom() == 3) {
      bot = "3"
    } else {
      for (let i = 0; i > -1; i++) {
        if (bot == "1" || bot == "2" || bot == "3") {
          break;
        }
        bot = itemRandom()
      }
    }

    if (item == "r" && bot == "1") {
      egal(item, interaction, this.client)
    } else if (item == "r" && bot == "2") {
      loose(item, value, interaction, this.client)
    } else if (item == "r" && bot == "3") {
      win(item, value, interaction, this.client)
    } else if (item == "p" && bot == "1") {
      win(item, value, interaction, this.client)
    } else if (item == "p" && bot == "2") {
      egal(item, interaction, this.client)
    } else if (item == "p" && bot == "3") {
      loose(item, value, interaction, this.client)
    } else if (item == "c" && bot == "1") {
      loose(item, value, interaction, this.client)
    } else if (item == "c" && bot == "2") {
      win(item, value, interaction, this.client)
    } else if (item == "c" && bot == "3") {
      egal(item, interaction, this.client);
    } else {
      interaction.reply("Il y a une erreur le créateur est claqué")
    }
  }
}
module.exports = Ping