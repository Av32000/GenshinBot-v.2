class Restart {
  exec(interaction) {
    interaction.reply({
      content: "Le bot reload",
      ephemeral: true
    })
    console.log("Restarting...")
    require('child_process').execSync("pm2 restart 0")
  }
}

module.exports = Restart