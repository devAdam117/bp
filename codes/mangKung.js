// zakladne moduly, ktore sa mozu pouzivat aj pre dalsie simulacie
const functions = require("./libs"); 
const chalk = require("chalk");

//miesto na ukladanie hracov a kociek + blueprinty, cez ktore ich vieme vyrobit
let players = [];

class Player  {
    constructor(id,name,gameMoney,wallet){
        this.id=id;
        this.name=name;
        this.gameMoney=gameMoney;
        this.wallet=wallet;
    }
}
let cubes = [];

class Cubes {
   constructor(firstWall,secondWall,thirdWall,fourthWall,fifthWall,sixthWall){
       this.firstWall=firstWall;
       this.secondWall=secondWall;
       this.thirdWall=thirdWall;
       this.fourthWall=fourthWall;
       this.fifthWall=fifthWall;
       this.sixthWall=sixthWall;

   }
}

// statistiky o ktore sa budeme, zaujimat po tom ako sa vykona simulacia
let stats = {
    newGames:0,
    rounds:0,
    lengthOfGames:[],
    winningPlayers:[],
    onTableMoneyHistory:[],
    lostMoneyInOneGame:[],
    lostMoneyInOneRound:[],
    maxLostMoneyInOneGame:[]
}

let startingWallets=[];
// kolko sa nachadza v dany moment na stole, je mozne ze niektory hrac bude musiet dat vsetky svoje peniaze ktore ma v penazenke, hra sa v dany moment konci
let moneyOnTable=0;


// na konci kola, je na tahu dalsi hrac na lavo od neho
const selectNextPlayer = (currentPlayer)=>{
    let indexOfCurrentPlayer= players.findIndex(player => player==currentPlayer);
    if(indexOfCurrentPlayer===0) return players[players.length-1];
    else return players[indexOfCurrentPlayer-1];
}



// vsetka logika na osetrenie i-teho kola
const handleRound = (player,moneyOnTable,gameType) => {
    let cubesSum = 0;
    let index = players.findIndex(e => (e.id === player.id));

    cubes.forEach(cube => {
        cubesSum += functions.chooseRandomKey(cube);
    })
    
    if(cubesSum < moneyOnTable){
        stats.lostMoneyInOneRound.push(0);
        moneyOnTable -= cubesSum // vzdy > 0        
        players[index].gameMoney += cubesSum;     
        return {
            nextPlayer:selectNextPlayer(players[index]),
            currentTableValue:moneyOnTable,
            endGame:false
        };
    }
    else if(cubesSum > moneyOnTable){
        
        let diff = cubesSum-moneyOnTable;

        if(players[index].gameMoney-diff <0){

            moneyOnTable+= diff;
            stats.lostMoneyInOneRound.push(diff);
            let missingNumber =-(players[index].gameMoney-diff);
            players[index].gameMoney=0;
            players[index].wallet-missingNumber>0?  players[index].wallet-=missingNumber: players[index].wallet=0;
            return {
                nextPlayer:selectNextPlayer(players[index]),
                currentTableValue:moneyOnTable,
                endGame:false
            };

        }
        else {
            stats.lostMoneyInOneRound.push(0);
            let diff = cubesSum-moneyOnTable;
            moneyOnTable += diff;
            players[index].gameMoney-=diff;
            return {
                nextPlayer:selectNextPlayer(players[index]),
                currentTableValue:moneyOnTable,
                endGame:false
            };
        }
    }
    else {
        stats.lostMoneyInOneRound.push(0);
        let inGameMoney = 0;
        let arrToCheck= [];
        players.forEach((player,index) => {
            inGameMoney += player.gameMoney;
            stats.lostMoneyInOneGame.push(player.gameMoney);
            arrToCheck.push(player.gameMoney);
            player.gameMoney=0;
        })
        stats.maxLostMoneyInOneGame.push(functions.maxFromArr(arrToCheck));
        
        
        stats.winningPlayers.push(players[index].name);
        let totalRoundMoney = (inGameMoney+moneyOnTable);
        players[index].wallet+= totalRoundMoney;
        moneyOnTable=0;
        if(gameType==="random"){
            
            nextPlayer =selectNextPlayer(players[Math.floor(Math.random()*players.length)]);
        }
        else if(gameType==="normal"){
            nextPlayer=players[index];
        }
        else if(gameType==="fixed"){
            nextPlayer=players[0];
        }
        else {
            nextPlayer =selectNextPlayer(players[index]);
        }

        return {
            nextPlayer:nextPlayer,
            currentTableValue:moneyOnTable,
            endGame:true
        };
    }
}



// zapocatie hry, zakladne vlozenie potrebnych prostriedkov, urcenie zacinajuceho hraca atd...
const startGame = (players,rounds,gameType)=> {
        
    stats.newGames+=1;
    let startingBudget = 0;    
    players.forEach(player => {
        if(player.wallet-7>0){
        player.wallet-=7;
        //startingWallets.push(player.wallet);
        player.gameMoney=0;
        startingBudget +=7; 
        }
        else {
            return "Not enought funds for next game!";
        }
    })
    moneyOnTable=startingBudget;
    // 
    
    let startingPlayer = players[Math.floor(Math.random()*players.length)];
    let result = handleRound(startingPlayer,startingBudget,gameType);
    stats.rounds+=1; 
    let nextPlayer = result.nextPlayer;    
    moneyOnTable =result.currentTableValue;
    if(moneyOnTable===undefined){
        stats.onTableMoneyHistory.push("End")
    }
    else{
    stats.onTableMoneyHistory.push(moneyOnTable);
    }

    if(result.endGame) {

        startGame(players,rounds-1)
        return;
    };
    
        if(rounds!="bankruptcy" && rounds>=2){
            for(let i = 0 ; i<rounds-1; i++){
                if(players.findIndex(player=>(player.wallet===0 && player.gameMoney===0))===-1){
                    stats.rounds+=1; 
                    if(!result.endGame){                
                        result = handleRound(nextPlayer,moneyOnTable,gameType); 
                        moneyOnTable=result.currentTableValue;
                        nextPlayer = result.nextPlayer; 
                        if(moneyOnTable===undefined){
                            stats.onTableMoneyHistory.push("End")
                        }
                        else{
                        stats.onTableMoneyHistory.push(moneyOnTable);
                        }

                        
                    }
                    else{
                        // wallet logic
                        stats.lengthOfGames.push(i+1);
                        startGame(players,rounds-(i+1));
                        return;
                    }
            }
            else {
                return;
            }

                
            
            }
        }
        else  {
            let i=0;
            while(players.findIndex(player=>(player.wallet===0 && player.gameMoney===0))===-1){
                if(!result.endGame){  
                    i++;
                    stats.rounds+=1;              
                    result = handleRound(nextPlayer,moneyOnTable,gameType); 
                    moneyOnTable=result.currentTableValue;
                    nextPlayer = result.nextPlayer; 
                    if(moneyOnTable===undefined){
                        stats.onTableMoneyHistory.push("End")
                    }
                    else{
                    stats.onTableMoneyHistory.push(moneyOnTable);
                    }

                    
                }
                else{
                    // wallet logic
                    stats.lengthOfGames.push(i+1);
                    startGame(players,rounds-(i+1));
                    return;
                }

            }
        
}
    
    
    
}

//funkcia startSimulation zahrna v sebe vsetky potrebne funkcie a je to funkcia na "hranie" sa s parametrami a ovplyvnovanie statistik
startSimulation = (numOfPlayers,startingWallet,maxCube,gameLength,typeOfNextPlayer) => {
    for(let i = 0 ; i<numOfPlayers; i++){
        players.push( new Player(i+1,"Player"+(i+1),0,startingWallet));
    }
    for(let i = 1 ; i<=maxCube;i++){
        cubes.push(new Cubes(i,0,0,0,0,0));
    }
    startGame(players,gameLength,typeOfNextPlayer);
    
console.log(players);
console.log("Money left on table: "+chalk.greenBright(moneyOnTable));

players.forEach(player=>{
    
    console.log(`Player: ${chalk.blueBright(player.name)} has won total of : ${chalk.greenBright(functions.sumElement(stats.winningPlayers,player.name))} games`);    
})
console.log(`Estimately each round, player has to withdraw  ${chalk.greenBright(functions.roundDecimals(functions.mean(stats.lostMoneyInOneRound),3))} money from wallet to finish his turn`);
console.log(`Estimately each game, player has to withdraw ${chalk.greenBright(functions.roundDecimals(functions.mean(stats.lostMoneyInOneGame),3))}  from his wallet to finish game`);
console.log(`Disperzion for our estimation is ${chalk.greenBright(functions.roundDecimals(functions.S(stats.lostMoneyInOneGame,functions.mean(stats.lostMoneyInOneGame)),2))}`)
console.log(`There has been total of ${chalk.greenBright(stats.newGames)} new games with total of ${chalk.greenBright(stats.rounds-stats.winningPlayers.length)}`);
console.log(`Estimate length of one game is ${chalk.greenBright(functions.roundDecimals(functions.mean(stats.lengthOfGames),2))} rounds`);
console.log(`Estimate of max wallet withdrawals is ${chalk.greenBright(functions.roundDecimals(functions.mean(stats.maxLostMoneyInOneGame),2))} rounds`);
//console.dir(startingWallets, {'maxArrayLength': null})
//console.dir(stats.lostMoneyInOneRound,  {'maxArrayLength': null});
//console.dir(stats.lostMoneyInOneGame,  {'maxArrayLength': null});
//console.dir(stats.maxLostMoneyInOneGame,  {'maxArrayLength': null});



}

startSimulation(3,17,6,20,"normal");
//prvy parameter -> pocet hracov s kolkymi chceme simulovat danu hru
// druhy parameter -> kolko ma mat kazdy hrac na zaciatku v penazenke penazi (kazdy hrac ma tu istu zacinajucu sumu)
//  treti parameter -> kolko ma byt roznych kociek ? ,6 je normalne ale je mozne aj zvysit pocet ak dame parameter = 10 ->
// -> tak prva kocka ma na jednej stene jednotku inde 0, druha kocka na jednej stene dvojku inde nuly,..., desiata kocka na jednej stene desiatku inde nuly
//stvrty parameter -> dlzka simulacie - simulacia moze bezat fixny pocet kol, napr 100 a potom hra v dany moment skonci a pozrieme sa na statistiky hracov, ak by sa stalo ze do 100ho kola nejaky hrac zbankrotuje, hra sa ukonci predcasne
//                                      -"bankruptcy" simulacia bezi pokial nejaky prvy hrac zbankrotuje, tj. nema ziadne penize  v ruke ani v penazenke
// piaty parameter -> volba dalsieho hraca, ktory zacne hru, po tom ako sa skonci predchadzajuca hra  
//                                                                                                   -"random" zvoli nahodne dalsieho hraca  
//                                                                                                   - "normal" - podla pravidiel, zvoli hraca, ktory vyhral predchadzajucu hru
//                                                                                                   - "fixed" - kazdu hru zvoli na zaciatku fixne toho isteho hraca
// 5 th game in squid game
