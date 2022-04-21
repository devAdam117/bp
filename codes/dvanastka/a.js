const functions = require("../libs"); 
const chalk = require("chalk");
const fs = require('fs');
const arrayToTxtFile = require('array-to-txt-file');



const startSimulation=(nThrows,passingValue) => {
    let overPassedNums =  [];
    let currentSum=0;
   
    for(let i= 0; i<nThrows;i++) {
        let randomNum = Math.floor(Math.random() * 6 + 1);
        currentSum+= randomNum;        
        if(currentSum>passingValue){
            overPassedNums.push(currentSum);            
            currentSum=0;            
        }   
    }
    arrayToTxtFile([overPassedNums], './output.txt', err => {
        if(err) {
          console.error(err);
          return
        }
        console.log('Successfully wrote to txt file');
    })
    return overPassedNums;
}

//Display output
console.log(functions.showAbortion(startSimulation(1000000,12)));