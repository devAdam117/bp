const functions = require("../libs")
const chalk= require("chalk");
let cubes = [];
let sumsOfCubes = [];
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

 const createCubes = (num)=> {
    for(let i = 1 ; i<=num;i++){
        cubes.push(new Cubes(i,0,0,0,0,0));
    }
 }
 const showResult = (arr,numOfSimulations)=> {
    let dist = [];
    arr.forEach(el=>{
        if(dist.indexOf(el)===-1){
            dist.push(el);
        }
    })
    let obj = {};
    for(let i =0; i<=21;i++){
        obj[i]=0;
    }
    
    dist =functions.order(dist,"asc");
    
    
    dist.forEach(e=> {        
        arr.forEach(el=>{
            if(e===el){
                obj[e]+=1;
            }
        })
    })
    console.log((chalk.blueBright(`Počet simuláci: `)+chalk.greenBright(numOfSimulations)))
    console.log(obj);
    
    
 }
 
 const startSimulation = (numOfDices,numOfSimulations)=> {
    createCubes(numOfDices);
    for(let i =0;i<numOfSimulations;i++){        
        let sum = 0;
        cubes.forEach(cube=>{
           sum+= functions.chooseRandomKey(cube);
        })
        sumsOfCubes.push(sum);


    }
    showResult(sumsOfCubes,numOfSimulations);
    
 }

startSimulation(6,1000000);
//first argument - kolko kociek
// second argument - kolko simulacii