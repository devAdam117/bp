const simulation = require("./mangKung");
const functions = require("../libs");
const chalk = require("chalk");
const arrayToTxtFile = require('array-to-txt-file')
let players= [];
let cubes = [];
let moneyOnTable = 0;


const simulate = (firstTime,nPlayers,initWallet,nCubes,nRounds,nGames,gameType,winningPlayer,fixedPlayer) => {
    simulation.startGame(firstTime,nPlayers,initWallet,nCubes,nRounds,nGames,gameType,winningPlayer,fixedPlayer);

    
console.log(chalk.blueBright(`Stav po poslednom kole: `))
console.log(simulation.players)
console.log(`Zostatok žetónov na stole: ${chalk.greenBright(simulation.moneyOnTable)} `) 
console.log(chalk.blueBright(`Počty: `))
console.log(`Celkový # odohraných hier: ${chalk.greenBright(simulation.stats.gameCount)}`);
console.log(`Celkový # hodení kociek: ${chalk.greenBright(simulation.stats.roundCount)}`);
console.log(chalk.blueBright(`Stredné hodnoty:`))
console.log(`E(dĺžka jednej hry v kolách)= ${chalk.greenBright(functions.mean(simulation.stats.gameLenghts))}`)
console.log(`E(peňazí na stole)= ${chalk.greenBright(functions.roundDecimals(functions.mean(simulation.stats.moneyOnTable),2))}`)
console.log(chalk.blueBright(`Rozloženie : `))
 console.log(chalk.blueBright(`  Výhercov:`));
console.table(functions.showAbortion(simulation.stats.winners)); 
console.log(chalk.blueBright(`  Peňazí na stole:`));
console.table(functions.showAbortion(simulation.stats.moneyOnTable));   
console.dir((simulation.stats.maxMoneyLostPerGame),{'maxArrayLength': null});

}
simulate(true,3,5000,6,0,1000,"normal",false,false);

