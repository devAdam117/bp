const simulation = require("./mangKung");
const functions = require("../libs");
const chalk = require("chalk");

let winsH1 =[];
let winsH2 =[];
let winsH3 =[];
const bSimulation = (nGames, fixed) => {
    
    for(let j =0; j<100; j++){
        simulation.stats.winners=[];
     for(let i = 0 ; i<1000 ; i++){
         simulation.startGame(true,3,500,6,0,nGames,"normal",false,fixed);
     }
     
     winsH1.push(functions.showAbortion(simulation.stats.winners)["Player1"]/1000);
     winsH2.push(functions.showAbortion(simulation.stats.winners)["Player2"]/1000);
     winsH3.push(functions.showAbortion(simulation.stats.winners)["Player3"]/1000);
    
    }
    console.log(`Pomer vyhier hráča Player1 je ${chalk.greenBright(functions.roundDecimals((winsH1.reduce((acc,curr)=> acc+curr)/100),2))} `);
    console.log(`Pomer vyhier hráča Player2 je ${chalk.greenBright(functions.roundDecimals((winsH2.reduce((acc,curr)=> acc+curr)/100),2))} `);
    console.log(`Pomer vyhier hráča Player3 je ${chalk.greenBright(functions.roundDecimals((winsH3.reduce((acc,curr)=> acc+curr)/100),2))} `); 
    console.log(chalk.blueBright(`Celkovo sa odohralo 100 simulácií a v každej simulácií 1000 X ${nGames} hier`))   
    
    
}

bSimulation(1,true);
