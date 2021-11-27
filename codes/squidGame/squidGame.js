const functions = require("../libs"); 
const chalk = require("chalk");
const fs = require('fs');
const arrayToTxtFile = require('array-to-txt-file');

let numOfPlayers = 16;
let numOfGlassPairs = 15;
let yourNum = 16;
let players=  [];

class Player  {
    constructor(id,deaths,status){
        this.id=id;  // poradie              
        this.deaths=deaths;
        this.status=status
    }
}
const createPlayers = (num)=> {
    
    for(let i = 0 ; i<num ; i++){
        players.push(new Player(i,0,"start"));
    }
}

const startGame = (numOfPlayers,numOfGlassPairs) => {
    createPlayers(numOfPlayers);
    let currentGlass = 0;
    while(currentGlass < numOfGlassPairs  ){
        //handle round bude zvysoavt currentGlass, potom bude hracom pridavat na deadoch a takisto im bude menit status na status dead/survived

    }
}
