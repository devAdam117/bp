const functions = require("../libs"); 
const chalk = require("chalk");
const fs = require('fs');
const arrayToTxtFile = require('array-to-txt-file');



let stats = {
    nEscapee:[],
    nPairs:[]
}



const startGame = (nPlayers,nPairs,nSim) => {
    let livingPlayers;
    let unknownPairs;    
    for(let i =0 ; i < nSim ; i++){
        livingPlayers= nPlayers;
        unknownPairs = nPairs;
        while(livingPlayers>0 && unknownPairs>0){
              let decidingJump = Math.random();
            if(decidingJump>0.5){
                unknownPairs --;        
            }
            else {
                unknownPairs --;
                livingPlayers --;
                //console.log(nPairs-unknownPairs)
            }
        }        
        stats.nEscapee.push(livingPlayers);
        stats.nPairs.push(unknownPairs);
    }
}

let initPlayers = 16;
let initGlassPairs = 18;
let nSim = 1000;

startGame(initPlayers,initGlassPairs,nSim);
arrayToTxtFile([stats.nEscapee], './output.txt', err => {
    if(err) {
      console.error(err)
      return
    }
    console.log('Successfully wrote to txt file')
})
console.log(chalk.blueBright("Abortion of escapees:"))
console.table(functions.showAbortion(stats.nEscapee))
console.log(chalk.blueBright("Abortion of unknown pairs:"))
console.table(functions.showAbortion(stats.nPairs))




