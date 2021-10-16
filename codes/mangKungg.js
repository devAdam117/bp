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

let stats = {
    gamesCount:0,
    roundsCount:0,
    roundsPerGames:[],
    winningPlayers:[],
    onTableMoneyHistory:[],
    lostMoneyInOneGame:[],
    lostMoneyInOneRound:[],
    maxLostMoneyInOneGame:[]
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

const startGame= (firstTime,nPlayers,initWallet,nCubes,nRounds,nGames,gameType,winningPlayer) => {
          
     let resultOfRound= {            
            endGame: false,
            bankrupcy:false
        } 
    if(firstTime){
        createPlayers(nPlayers,initWallet);
        createCubes(nCubes);              
        resultOfRound["nextPlayer"]=players[Math.floor(Math.random()*players.length)];
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
        for(let i=0;i<nRounds;i++){
            if(!resultOfRound.endGame && !resultOfRound.bankrupcy){                
                resultOfRound = handleRound(resultOfRound);
            }
            else if(resultOfRound.endGame && !resultOfRound.bankrupcy) {
                startGame(false,false,false,false,(nRounds-i-1),false,gameType,resultOfRound.winningPlayer);
                //dokonci hru 
                return;
            }
            else if(!resultOfRound.bankrupcy){
                console.log("Some of players has banckrupted!");
                return;

            }
        }
    }
    else if (Number.isInteger(nGames) && !nRounds){
           if(nGames>0){

               while(!resultOfRound.endGame && !resultOfRound.bankrupcy){                
                   
                   resultOfRound = handleRound(resultOfRound);                
               }
               // ked skonciHra zober vsetkym hracom vklad na novu hru
               if(resultOfRound.endGame && !resultOfRound.bankrupcy){
                   startGame(false,false,false,false,false,(nGames-1),gameType,resultOfRound.winningPlayer);
                   return;
               }
               else if (resultOfRound.bankrupcy){
                   return;
       
               }
           }
           else {
               return;
           }

        
    }
    else if (nRounds==="bankrupcy" && !nGames){
        while(!resultOfRound.endGame && !resultOfRound.bankrupcy){
            resultOfRound = handleRound(resultOfRound);            
        }
        if(resultOfRound.endGame && !resultOfRound.bankrupcy){
            startGame(false,false,false,false,"bankrupcy",false,gameType,resultOfRound.winningPlayer);
            return;
        }
        else if (resultOfRound.bankrupcy){
            return;

        }
    }
    

}
startGame(true,3,500,6,0,1000,"normal",false)
//vsetko funguje jak ma amigo :-) pohra sa s tym 
console.log(players)
console.log(moneyOnTable)
//console.log(winners);














