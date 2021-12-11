const fs = require('fs');
const path = require('path');
const { MongoClient } = require("mongodb");
const {MONGOSTRING} = require('../../util/config'); 
const {MessageAttachment} = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const randomColor = () => Math.floor(Math.random() * 255) + 1;

class Ping{
  async exec(interaction, ThisClient) {

    let user = []
    let colors = []
    let primos = []

    const uri = MONGOSTRING;
    const client = new MongoClient(uri);
      
    try {
      await client.connect();
      const database = client.db("sample_mflix");


      const items = await database.collection('movies').find({}).toArray();
      //Ajout users a l'array
      items.forEach(element => {
        if(!element.content == "0" && !element.content == ""){
          let userTag = ThisClient.users.cache.find(user => user.id === element.title);
          if(userTag == undefined){
            user.push(userTag)
            primos.push(element.content)
          }else{
            user.push(userTag.tag);
            primos.push(element.content);
          }
        }
      });
    } finally {
     await client.close();
    }
    if(user.length == 0){
      return interaction.reply({
        content: "Aucun utilisateur n'a de primos gemmes",
        ephemeral: true
      });
    }
    
    //Génération des couleurs
    let r = 0;
    let g = 0;
    let b = 0;
    let existColor = [];
    user.forEach(element => {
      let colorR
      let colorG
      let colorB

      for(let i = 1; i > 0; i++){
        colorR = randomColor();
        colorG = randomColor();
        colorB = randomColor();
        let colorComplete = `${colorR},${colorG},${colorB}`
        if(!existColor.includes(colorComplete)){
          existColor.push(colorComplete)
          break
        }
      }

      let color = `rgb(${colorR}, ${colorG}, ${colorB})`
      colors.push(color);
    });

    //#region Chart
    const width = 400; //px
    const height = 400; //px
    const backgroundColour = 'white';
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

    const data = {
      labels: user,
      datasets: [{
        label: 'Chart',
        data: primos,
        backgroundColor: colors,
        hoverOffset: 4
      }]
    };

    const configuration = {
      type: 'pie',
      data: data
    };

    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    await fs.writeFile(path.join(__dirname, "../../img/chart.png"), buffer, (err) => {
      if (err){
        console.log(err);
      }});
    //#endregion
    
    const attachement = new MessageAttachment(path.join(__dirname, "../../img/chart.png"))

    interaction.reply({
      content : "Voici, ",
      files: [attachement]
    })
  }
}
module.exports = Ping