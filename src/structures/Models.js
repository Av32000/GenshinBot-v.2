const {Schema, model} = require("mongoose");

const guildSchema = new Schema({
  id: String,
  prefix: {
    type: String,
    default: "/"
  }
})

const coinsSchema = new Schema({
  id: String,
  content: {
    type: Number,
    default: 0
  }
})

module.exports = {
  Guild: model('Guild', guildSchema),
  Coins: model('Coins', coinsSchema),
}