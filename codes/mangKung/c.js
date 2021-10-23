const simulation = require("./mangKung");
const functions = require("../libs");
const chalk = require("chalk");
let numberOfGames = 50;  // 1 pre Table5 ,>1 pre Table 6
let fixedPlayer = true;
simulation.cSimulation(numberOfGames,fixedPlayer);
console.log( `E(výhra ${chalk.blueBright("H_1")}) je približne ${chalk.greenBright(functions.mean(simulation.stats.oneGameTest[0].wallet))}`);
console.log(`E(výhra ${chalk.blueBright("H_2")}) je približne ${chalk.greenBright(functions.mean(simulation.stats.oneGameTest[2].wallet))}`);
console.log(`E(výhra ${chalk.blueBright("H_3")}) je približne ${chalk.greenBright(functions.mean(simulation.stats.oneGameTest[1].wallet))}`);
console.log(`Testovalo sa na 1000 simuláciach, kde v jednej simulácií sa hralo ${numberOfGames} ${numberOfGames> 1? "hier":"hru"} a prvú hru bol hráč ${fixedPlayer ? "fixne vybratý":"náhodne vybratý"}`);