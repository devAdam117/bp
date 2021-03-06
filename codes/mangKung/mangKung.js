const functions = require("../libs"); 
const chalk = require("chalk");
const fs = require('fs');
const arrayToTxtFile = require('array-to-txt-file')
let players = [];
let cubes = [];
let winners= [];
let walletArchive = [];
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
    players = [];
    
        for(let i = 0 ; i<n; i++){
            players.push( new Player(i+1,"Player"+(i+1),wallet));
        }

    
    

    
}
const createCubes = (n) => {
    cubes = [];
    for(let i = 1 ; i<=n;i++){
        cubes.push(new Cubes(i,0,0,0,0,0));
    }

}
const initWithdrawal = (players,fixedWithdrawal) => {
    if(!fixedWithdrawal){
        
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
        
    
        
    }
    else {
       
        
        
        players.forEach(player=>{
            if(player.wallet-fixedWithdrawal>0){
            player.wallet -= fixedWithdrawal;  
            moneyOnTable+= fixedWithdrawal;            
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

const archiveWallet = (fixedNum)=> {
    let initWallets =[];
    if(fixedNum){
     players.forEach(player=> initWallets.push(fixedNum));

    }
    else {
     players.forEach(player=> initWallets.push(player.wallet))
    }
     return initWallets; 
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
        let walletDiff =functions.arraysOperatos(walletArchive, "-", archiveWallet());  
        stats.maxMoneyLostPerGame.push(functions.maxFromArr(walletDiff));
        walletArchive = archiveWallet();      
        return {
            nextPlayer:nextPlayer,
            moneyOnTable:moneyOnTable,
            endGame:true,
            winningPlayer:players[indexOfCurrentPlayer],
            bankrupcy:false
        }
    }


}

const startGame= (firstTime,nPlayers,initWallet,nCubes,nRounds,nGames,gameType,winningPlayer,fixedPlayer,initWithdrawalAmount) => {
          
     let resultOfRound= {            
            endGame: false,
            bankrupcy:false
        } 
        if(firstTime){
            createPlayers(nPlayers,initWallet);
            createCubes(nCubes);              
            fixedPlayer? resultOfRound["nextPlayer"]=players[0]: resultOfRound["nextPlayer"]=players[Math.floor(Math.random()*players.length)];
            resultOfRound["moneyOnTable"]=initWithdrawal(players,initWithdrawalAmount);
            stats.moneyOnTable.push(resultOfRound.moneyOnTable)
            walletArchive=archiveWallet(initWallet);  
            
        }
    else {
        walletArchive=archiveWallet();  
        if(gameType==="normal"){
            resultOfRound["nextPlayer"]=winningPlayer;    
            resultOfRound["moneyOnTable"]=initWithdrawal(players,initWithdrawalAmount);
            stats.moneyOnTable.push(resultOfRound.moneyOnTable)

        }
        else if (gameType==="random"){
            resultOfRound["nextPlayer"]=players[Math.floor(Math.random()*players.length)]; 
            resultOfRound["moneyOnTable"]=initWithdrawal(players,initWithdrawalAmount);

        }
        else if(gameType==="fixed"){
            resultOfRound["nextPlayer"]=players[0]; 
            resultOfRound["moneyOnTable"]=initWithdrawal(players,initWithdrawalAmount);

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
                startGame(false,false,false,false,(nRounds-i-1),false,gameType,resultOfRound.winningPlayer,false,initWithdrawalAmount);
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
                   /* console.log(players)                                   
                   console.log(gameLenght) */
               }
               // ked skonciHra zober vsetkym hracom vklad na novu hru
               if(resultOfRound.endGame && !resultOfRound.bankrupcy){                   
                   stats.gameLenghts.push(gameLenght);
                   stats.gameCount++;
                   startGame(false,false,false,false,false,(nGames-1),gameType,resultOfRound.winningPlayer,false,initWithdrawalAmount);
                   return;
               }
               else if (resultOfRound.bankrupcy){
                   stats.bankrupcyRounds +=1;
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
            startGame(false,false,false,false,"bankrupcy",false,gameType,resultOfRound.winningPlayer,false,initWithdrawalAmount);
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
    moneyWonPerGame : [],
    oneGameTest :[],
    bankrupcyRounds:0
}

    // TEST NA JEDNU HRU CI HRAC MA VYHODU NA PRIEMERNU VYHRU
        const cSimulation = (nGames,fixed) => {
            let i =0;
            while(i<5000){
                startGame(true,3,5000,6,0,nGames,"normal",false,fixed,false);
                players.forEach(player => {
                    stats.oneGameTest.push({
                        name:player.name,
                        wallet:[],
                        meanVals : []
                    })
                })
                
                
                players.forEach((player) => {
                    stats.oneGameTest.forEach(archiveName => {
                        if(player.name===archiveName.name){
                            archiveName.wallet.push(player.wallet);
                           // archiveName.meanVals.push(functions.mean(player.wallet));
                        }
                    })
                })
                //stats.oneGameTest[0].meanVals.push(functions.fastMean(stats.oneGameTest[0].wallet.length,stats.oneGameTest.wall));
                console.log(i)
                i++;
            }
            arrayToTxtFile([stats.oneGameTest[0].wallet,"first",stats.oneGameTest[2].wallet,"second",stats.oneGameTest[1].wallet,"third"], './output.txt', err => {
                if(err) {
                  console.error(err)
                  return
                }
                console.log('Successfully wrote to txt file')
            })
             /* console.dir(stats.oneGameTest[0].wallet,{'maxArrayLength': null});
            console.dir(stats.oneGameTest[2].wallet,{'maxArrayLength': null});
            console.dir(stats.oneGameTest[1].wallet,{'maxArrayLength': null}); */
            //Stredne hodnoty x_i konvergencia...
            /* console.dir(stats.oneGameTest[0].meanVals,{'maxArrayLength': null});
            console.dir(stats.oneGameTest[2].meanVals,{'maxArrayLength': null});
            console.dir(stats.oneGameTest[1].meanVals,{'maxArrayLength': null});      */               
           
               } 


               
        
       // TEST na ulohu b), ci ma fixny hrac vacsiu pp na vyhru pri jednej opakovanej hre  
       
       const gSimulation=(nGames)=> {
            startGame(true,3,5000,6,0,nGames,"normal",false,false,false);
            console.log(stats.maxMoneyLostPerGame);
            arrayToTxtFile([stats.maxMoneyLostPerGame], './output.txt', err => {
                if(err) {
                console.error(err)
                return
                }
                console.log('Successfully wrote to txt file')
            })

       }
    
 
    
    
const simulate = (firstTime,nPlayers,initWallet,nCubes,nRounds,nGames,gameType,winningPlayer,fixedPlayer,initWithdrawalAmount) => {

    startGame(firstTime,nPlayers,initWallet,nCubes,nRounds,nGames,gameType,winningPlayer,fixedPlayer,initWithdrawalAmount);
    test.push(players[0].wallet);
       /* console.log(stats.roundCount)
    console.log(chalk.blueBright(`Stav po poslednom kole: `))
    console.log(players) */
    /*
    console.log(`Zostatok ??et??nov na stole: ${chalk.greenBright(moneyOnTable)} `)  
      console.log(chalk.blueBright(`Po??ty: `))
    console.log(`Celkov?? # odohran??ch hier: ${chalk.greenBright(stats.gameCount)}`);
    console.log(`Celkov?? # hoden?? kociek: ${chalk.greenBright(stats.roundCount)}`);
    console.log(chalk.blueBright(`Stredn?? hodnoty:`))  
    console.log(`E(d????ka jednej hry v kol??ch)= ${chalk.greenBright(functions.mean(stats.gameLenghts))}`) 
     console.log(`E(pe??az?? na stole)= ${chalk.greenBright(functions.roundDecimals(functions.mean(stats.moneyOnTable),2))},`) */
     /*  console.log(chalk.blueBright(`Rozlo??enie : `))
    console.log(chalk.blueBright(`  V??hercov:`));
    console.table(functions.showAbortion(stats.winners)); 
    arrayToTxtFile([stats.moneyOnTable], './output.txt', err => {
        if(err) {
          console.error(err)
          return
        }
        console.log('Successfully wrote to txt file')
    })
    console.log(chalk.blueBright(`  Pe??az?? na stole:`));
   console.table(functions.showAbortion(stats.moneyOnTable));  
    console.log(chalk.blueBright(`Maximaln?? prehry histo-tabulka`))     
    console.log((functions.showAbortion(stats.maxMoneyLostPerGame)));
    */    
}

    let test = [];
    for(let i = 0 ; i < 1000 ; i++){
        simulate(true,3,5000,6,0,100,"normal",false,true)
    }
    console.log(functions.mean(test))
    /*simulate(true,3,5000,6,0,1000,"fixed",false,true,false)
    simulate(true,3,5000,6,0,1000,"fixed",false,true,false)
    simulate(true,3,5000,6,0,1000,"fixed",false,true,false)
    simulate(true,3,5000,6,0,1000,"fixed",false,true,false)
    simulate(true,3,5000,6,0,1000,"fixed",false,true,false)
    simulate(true,3,5000,6,0,1000,"fixed",false,true,false)
    simulate(true,3,5000,6,0,1000,"fixed",false,true,false)
    simulate(true,3,5000,6,0,1000,"fixed",false,true,false)
    simulate(true,3,5000,6,0,1000,"fixed",false,true,false)
    */

// Prvy argument => je to prva hra? :true/dalse
// Druhy argument => kolko je hracov : int od 3 po n
// Treti argument => kolko ma mat kazdy hrac na zaciatku zetonov :int od 0 po n
// Stvrty argument => kolko je kociek ?  analogicky ak by bolo 10 kociek tak 10. kocka ma na jednej stene 10 a inde nuly : int od  1 po n
// Piaty argument => hra ma skoncit po  nejakom pocte hodov kociek :int  od 0 po n (ak nejaky hrac pred n-tym hodom zbrankrotuje tak hra konci predcasne)
// Siesty argument => o aky typ hry ide ? :"fixed" - kazdu hru bude na zaciatku  fixne vybraty hrac1 
//                                        :"normal" - vyber dalsieho hraca podla pravidiel
//                                        :"random" - vyber dalsieho hraca nahodne
//Siedmy argumnt => je nejaky vyherca hry? :false - samotna hra si to vyplna za seba, takze nechat to na false
//Osmy argument => prvy hrac v prvu hru ma byt vybrane fixne ? : true/false 
// posledny argument => novy pociatocny vklad na hraca

exports.stats= stats;
exports.startGame= startGame;
exports.gSimulation = gSimulation;
exports.cSimulation=cSimulation













