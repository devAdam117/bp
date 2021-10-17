const functions = require("./libs"); 
const chalk = require("chalk");
let players = [];
let cubes = [];
let winners= [];
class Player  {
    constructor(id,name,wallet){
        this.id=id;
        this.name=name;        
        this.wallet=wallet;
    }
}
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



// kolko sa nachadza na stole
let moneyOnTable=0;

const selectNextPlayer = (currentPlayer)=>{
    let indexOfCurrentPlayer= players.findIndex(player => player.id==currentPlayer.id);
    if(indexOfCurrentPlayer===0) return players[players.length-1];
    else return players[indexOfCurrentPlayer-1];
}
const createPlayers = (n,wallet) => {
    
    for(let i = 0 ; i<n; i++){
        players.push( new Player(i+1,"Player"+(i+1),wallet));
    }
}
const createCubes = (n) => {
    for(let i = 1 ; i<=n;i++){
        cubes.push(new Cubes(i,0,0,0,0,0));
    }

}
const initWithdrawal = (players) => {
    let k=1;
    
    while(!Number.isInteger((k*21)/players.length)){
        k++;
    
    }
    
    let playersWithdrawal=((k*21)/players.length);
    if(players.length!=3){ 
    

        players.forEach(player=>{
            if(player.wallet-playersWithdrawal>0){
            player.wallet -= playersWithdrawal;  
            moneyOnTable+= playersWithdrawal; 
            }
            else {
                return {
                    bankrupcy:true
                };
            }
        })
    

    }

    else {
    

        players.forEach(player=> {
            
            if(player.wallet-7>0){
            player.wallet-=7;           
            moneyOnTable +=7; 
            }
            else {
                return {
                    bankrupcy:true
                };
            }
        })
    


    }
    

    return moneyOnTable;
}
let i = 0;
const handleRound = (prevResult) => {
    i++;  
    
    moneyOnTable = prevResult.moneyOnTable;  
     
    let indexOfCurrentPlayer =players.findIndex(player => player.id === prevResult.nextPlayer.id);
    let nextPlayer = selectNextPlayer(players[indexOfCurrentPlayer]);
    let cubesSum = 0;
    cubes.forEach(cube => {
        cubesSum += functions.chooseRandomKey(cube);
    })
    
    if(cubesSum < moneyOnTable){
        players[indexOfCurrentPlayer].wallet += cubesSum;
        moneyOnTable -= cubesSum;
        stats.moneyOnTable.push(moneyOnTable);
        return {
            nextPlayer:nextPlayer,
            moneyOnTable:moneyOnTable,
            endGame:false,
            bankrupcy:false
        }
    }
    else if(cubesSum> moneyOnTable){
        let diff = cubesSum-moneyOnTable;
        if(players[indexOfCurrentPlayer].wallet-diff >=0){
            players[indexOfCurrentPlayer].wallet -= diff;
            moneyOnTable += diff;    
            stats.moneyOnTable.push(moneyOnTable);

            return {
                nextPlayer:nextPlayer,
                moneyOnTable:moneyOnTable,
                endGame:false,
                bankrupcy:false
                
            }
        }
        else {
            return {                
                bankrupcy:true
            }
        }

    }
    else  {
        moneyOnTable =0;
        let moneyFromPlayers = 0;
        players.forEach(player=> {
            if(player.wallet-cubesSum>=0){
                moneyFromPlayers+=cubesSum;
                player.wallet-=cubesSum;
            }
            else {
                return {
                    bankrupcy:true
                }
            }
        })                
        players[indexOfCurrentPlayer].wallet += (cubesSum+moneyFromPlayers);
        stats.winners.push(players[indexOfCurrentPlayer].name);
        stats.moneyOnTable.push(0);
        winners.push(players[indexOfCurrentPlayer].name);
        return {
            nextPlayer:nextPlayer,
            moneyOnTable:moneyOnTable,
            endGame:true,
            winningPlayer:players[indexOfCurrentPlayer],
            bankrupcy:false
        }
    }


}

const startGame= (firstTime,nPlayers,initWallet,nCubes,nRounds,nGames,gameType,winningPlayer,fixedPlayer) => {
          
     let resultOfRound= {            
            endGame: false,
            bankrupcy:false
        } 
    if(firstTime){
        createPlayers(nPlayers,initWallet);
        createCubes(nCubes);              
        fixedPlayer? resultOfRound["nextPlayer"]=players[0]: resultOfRound["nextPlayer"]=players[Math.floor(Math.random()*players.length)];
        resultOfRound["moneyOnTable"]=initWithdrawal(players);  
                
    }
    else {
        if(gameType==="normal"){
            resultOfRound["nextPlayer"]=winningPlayer;    
            resultOfRound["moneyOnTable"]=initWithdrawal(players);

        }
        else if (gameType==="random"){
            resultOfRound["nextPlayer"]=players[Math.floor(Math.random()*players.length)]; 
            resultOfRound["moneyOnTable"]=initWithdrawal(players);

        }
        else if(gameType==="fixed"){
            resultOfRound["nextPlayer"]=players[0]; 
            resultOfRound["moneyOnTable"]=initWithdrawal(players);

        }
    }
        
    
    if(Number.isInteger(nRounds) && !nGames){
        let gameLenght=0;
        for(let i=0;i<nRounds;i++){
            stats.roundCount++;
            if(!resultOfRound.endGame && !resultOfRound.bankrupcy){                
                resultOfRound = handleRound(resultOfRound);
            }
            else if(resultOfRound.endGame && !resultOfRound.bankrupcy) {                
                gameLenght=i+1
                stats.gameLenghts.push(gameLenght)
                stats.gameCount++;
                startGame(false,false,false,false,(nRounds-i-1),false,gameType,resultOfRound.winningPlayer);
                //dokonci hru 
                return;
            }
            else if(resultOfRound.bankrupcy){
                console.log(chalk.redBright(`Some of players has already banckrupted, game has stopped. There are ${chalk.greenBright(nRounds)}  rounds missing for fullfill argument of simulation!`));
                return;

            }
        }
    }
    else if (Number.isInteger(nGames) && !nRounds){
           if(nGames>0){
               let gameLenght=0;
               while(!resultOfRound.endGame && !resultOfRound.bankrupcy){    
                   gameLenght++ ;        
                   stats.roundCount++;
                   resultOfRound = handleRound(resultOfRound);                
               }
               // ked skonciHra zober vsetkym hracom vklad na novu hru
               if(resultOfRound.endGame && !resultOfRound.bankrupcy){                   
                   stats.gameLenghts.push(gameLenght);
                   stats.gameCount++;
                   startGame(false,false,false,false,false,(nGames-1),gameType,resultOfRound.winningPlayer);
                   return;
               }
               else if (resultOfRound.bankrupcy){
                   console.log(chalk.redBright(`Some of players has banckrupted, game has stoped! There are ${chalk.greenBright(nGames)} games missing to fullfill argument of simulation!`));
                   return;
       
               }
           }
           else {
               return;
           }

        
    }
    else if (nRounds==="bankrupcy" && !nGames){
        let gameLenght=0;
        while(!resultOfRound.endGame && !resultOfRound.bankrupcy){
            stats.roundCount++;
            gameLenght++
            resultOfRound = handleRound(resultOfRound);            
        }
        if(resultOfRound.endGame && !resultOfRound.bankrupcy){
            stats.gameCount++;
            stats.gameLenghts.push(gameLenght);
            startGame(false,false,false,false,"bankrupcy",false,gameType,resultOfRound.winningPlayer,true);
            return;
        }
        else if (resultOfRound.bankrupcy){
            console.log(chalk.yellowBright("Some of players has banckrupted, generating stats...."));
            return;
        }
    }
    

}
let stats = {
    roundCount:0,
    gameCount:0,
    gameLenghts: [],
    winners:[],
    moneyOnTable:[],
    maxMoneyLostPerGame : [],
    moneyWonPerGame : []
}

    startGame(true,3,500,6,0,1,"normal",false,players[0])

//vsetko funguje jak ma amigo :-) pohra sa s tym 
console.log(chalk.blueBright(`Stav po poslednom kole: `))
console.log(players)
console.log(`Zostatok žetónov na stole: ${chalk.greenBright(moneyOnTable)} `)

console.log(chalk.blueBright(`Počty: `))
console.log(`Celkový # odohraných hier: ${chalk.greenBright(stats.gameCount)}`);
console.log(`Celkový # hodení kociek: ${chalk.greenBright(stats.roundCount)}`);
console.log(chalk.blueBright(`Stredné hodnoty:`))
console.log(`E(dĺžka jednej hry v kolách)= ${chalk.greenBright(functions.mean(stats.gameLenghts))}`)
console.log(`E(peňazí na stole)= ${chalk.greenBright(functions.mean(stats.moneyOnTable))}`)
console.log(chalk.blueBright(`Rozloženie : `))
console.log(chalk.blueBright(`  Výhercov:`));
console.table(functions.showAbortion(stats.winners));
console.log(chalk.blueBright(`  Peňazí na stole:`));
console.table(functions.showAbortion(stats.moneyOnTable));
















