const functions = require("./libs");
let stats = {};

const createCircleArray = (num)=> {
    let circle = [];
    for(let i=0; i<num;i++){
        circle.push(i);
    }
    return circle
}
const handleMove = (currElementOnCircle,circle,propLeft) => {

    if(propLeft>=1 || propLeft<=0) return false;
    let indexOfElement =circle.indexOf(currElementOnCircle);
    let decider  = functions.R(0,1,"dec");
    let newElementOnCircle;

    if(decider<=propLeft){
        if(indexOfElement===0){
            newElementOnCircle=circle[circle.length-1];
        }
        else{
            newElementOnCircle=circle[indexOfElement-1];
        }
        handleMove(newElementOnCircle,circle,propLeft);
    }
    else {        
        if(indexOfElement===circle.length-1){
            newElementOnCircle= circle[0];
        }
        else {
            newElementOnCircle= circle[indexOfElement+1];
        }

    }
    return newElementOnCircle;
    


}
let result=0;
while(result!=1){
    console.log(result);
    result =handleMove(result,[0,1,2,3,4,5,6,7,8,9,10],0.5);
}



const circleSimulation = (betAmount,betNumber,betWay,numsOnCircle,propGoingLeft,propGoingRight,payBackMultiplicator) => {
    let circle = createCircleArray(numsOnCircle);

}