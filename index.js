const GotoClient = require('./src/structures/GotoClient');
const dotenv = require('dotenv')

let client = new GotoClient({prefix: 'g/'});
dotenv.config()
client.start(process.env.TOKEN);