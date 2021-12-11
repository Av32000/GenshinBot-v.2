const { Listener } = require('discord-akairo');
const { Constants } = require('discord.js')
const { invocPerso, invocSt, invocStP, MONGOSTRING } = require('../../util/config')
const { MongoClient } = require("mongodb");
class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec(client) {
        //#region Récupération des prix des invocs dans la BDD
        const uri = MONGOSTRING;
        const clientBDD = new MongoClient(uri);
        try {
            await clientBDD.connect();
            const database = clientBDD.db("Data");
            const movies = database.collection("Start");

            const invocStFilter = { title: `invocSt` };
            const invocStPFilter = { title: `invocStP` };
            const invocPersoFilter = { title: `invocPerso` };

            const invocStElement = await movies.findOne(invocStFilter);
            const invocStPElement = await movies.findOne(invocStPFilter);
            const invocPersoElement = await movies.findOne(invocPersoFilter);

            if (invocStElement != null) {
                invocSt.push(parseInt(invocStElement.content))
            }
            if (invocStPElement != null) {
                invocStP.push(parseInt(invocStPElement.content))
            } if (invocPersoElement != null) {
                invocPerso.push(parseInt(invocPersoElement.content))
            }

        } finally {
            await clientBDD.close();
        }

        console.log(`Invoc classique : ${invocSt}`);
        console.log(`Invoc Premium : ${invocStP}`);
        console.log(`Invoc Perso : ${invocPerso}`);
        //#endregion

        const guildID = "889899786885550151"
        const guild = client.guilds.cache.get(guildID)
        let commands

        if (guild) {
            commands = guild.commands
        } else {
            commands = client.application.commands
        }

        commands?.create({
            name: "ping",
            description: "Renvoie Pong si le bot est pret !",
        })

        commands?.create({
            name: "chart",
            description: "Retourne un diagramme de la répartition des primos gemmes par utilisateur",
        })

        commands?.create({
            name: "setup",
            description: "Enregistre l'utilisateur dans la base de donnée",
        })

        commands?.create({
            name: "reload",
            description: "Restart le bot",
        })

        commands?.create({
            name: "test",
            description: "Execute le code de test",
        })

        commands?.create({
            name: "invoc",
            description: "Permet de faire une invocation",
        })

        commands?.create({
            name: "invoc_premium",
            description: "Permet de faire une invocation premium",
        })

        commands?.create({
            name: "patch_note",
            description: "Affiche le dernier patch note",
        })

        commands?.create({
            name: "support",
            description: "Envoie l'embed support",
        })

        commands?.create({
            name: "version",
            description: "Envoie la version du bot",
        })

        commands?.create({
            name: "close",
            description: "Ferme un ticket",
        })

        commands?.create({
            name: "say",
            description: "Fait parler le bot",
            options: [
                {
                    name: "message",
                    description: "Le message à dire",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })

        commands?.create({
            name: "log",
            description: "Affiche les informations d'un utilisateur",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER
                },
                {
                    name: "message",
                    description: "Le message",
                    required: false,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })

        commands?.create({
            name: "set_maintenance",
            description: "Mets une commande en maintenance",
            options: [
                {
                    name: "command",
                    description: "La commande",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                },
                {
                    name: "reason",
                    description: "La raison",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })

        commands?.create({
            name: "set_active",
            description: "Réaactive une commande en maintenance",
            options: [
                {
                    name: "command",
                    description: "La commande",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })

        commands?.create({
            name: "blacklist",
            description: "BlackList un utilisateur",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur'",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER,
                }
            ]
        })

        commands?.create({
            name: "rpc",
            description: "Lance un Pierre Papier Ciseaux",
            options: [
                {
                    name: "type",
                    description: "Que jouer ?",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                },
                {
                    name: "value",
                    description: "Combien de primos gemmes parier ?",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.NUMBER
                }
            ]
        })

        commands?.create({
            name: "roulette",
            description: "Lance la roulette"
        })

        commands?.create({
            name: "daily",
            description: "Permet de récupérer 90 primos gemmes chaque jour"
        })

        commands?.create({
            name: "unblacklist",
            description: "unBlackList un utilisateur",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur'",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER
                }
            ]
        })

        commands?.create({
            name: "maintenance_list",
            description: "Liste des commandes en maintenance",
            options: [
                {
                    name: "command",
                    description: "La commande",
                    required: false,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })

        commands?.create({
            name: "userinfo",
            description: "Affiche les informations d'un utilisateur",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER
                }
            ]
        })

        commands?.create({
            name: "add_owner",
            description: "Ajoute un owner au bot",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur a ajouter",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER
                }
            ]
        })

        commands?.create({
            name: "mp",
            description: "Mp un utilisateur",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER
                },
                {
                    name: "message",
                    description: "Le message",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })

        commands?.create({
            name: "add_coins",
            description: "Ajoute des primos gemmes à un utilisateur",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER
                },
                {
                    name: "value",
                    description: "Nombre de primos gemmes à ajouter",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.NUMBER
                }
            ]
        })

        commands?.create({
            name: "remove_coins",
            description: "Retire des primos gemmes à un utilisateur",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER
                },
                {
                    name: "value",
                    description: "Nombre de primos gemmes à retirer",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.NUMBER
                }
            ]
        })

        commands?.create({
            name: "coins",
            description: "Affiche le nombre de primos gemmes d'un utilisateur",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur",
                    required: false,
                    type: Constants.ApplicationCommandOptionTypes.USER
                }
            ]
        })

        commands?.create({
            name: "triggered",
            description: "Triggered un prof !",
            options: [
                {
                    name: "prof",
                    description: "La victime",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING
                }
            ]
        })

        commands?.create({
            name: "remove_owner",
            description: "Retire un owner au bot",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur a retirer",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER
                }
            ]
        })

        commands?.create({
            name: "set_coins",
            description: "Definis le nombre de primo gemmes d'un utilisateur",
            options: [
                {
                    name: "user",
                    description: "L'utilisateur",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.USER
                },
                {
                    name: "value",
                    description: "Le nombre de primo gemmes",
                    required: true,
                    type: Constants.ApplicationCommandOptionTypes.NUMBER
                }
            ]
        })

        //Envoi un log de démarrage dans la console
        console.log('I\'m ready!');
    }
}

module.exports = ReadyListener;