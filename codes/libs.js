const chooseRandomKey = (object)=>{
    let keys = Object.keys(object);
    let randomKey = keys[Math.floor(Math.random()*keys.length)];
    
    
    return object[randomKey];
}

const sumElement=(array,element) => {
    let totalSum = 0;
    array.forEach(e => {
        e===element?  totalSum++:0;
    });
    return totalSum;
    
}

const mean = (array) => {
    let n=array.length;
    let value =0;
    array.forEach(el=> value+=el);
    return value/n;
}

const roundDecimals=(num,dec)=> {
    if(dec>0){
        let multiplicator = Math.pow(10,dec)
        return Math.round(num*multiplicator)/multiplicator;
    }
}
const checkValues = (...args)=> {
    let keys = [];
    let values = [];
    let finalResult=true;
    args.forEach((e,index)=>{
        keys.push(args[2*index]);
        values.push(args[(2*index +1)]);
    })
    if(keys.length===values.length){
        
        keys.forEach((el,index)=>{
            if(el!=values[index]) finalResult=false;
        })
        return finalResult;
    }
    else {
        return false;
    }
}

const R = (from,to,type)=> {

    if(type==="int"){
        return Math.round(Math.random()*(to-from) + from);
        
    }
    else if (type==="dec"){
        return Math.random()*(to-from)+from;
    }

    
}
const order = (arr,type) => {
    if(type==="des"){
        return arr.sort((a,b)=>a+b);
    }
    else if(type==="asc"){
        return arr.sort((a,b)=>a-b);
    }
}
const S =(arr,mean)=> {
    let n = arr.length;
    let sum = 0;
    arr.forEach(e=>{
        sum+=Math.pow((e-mean),2)
    })
    return Math.sqrt((1/(n-1))*sum);
}

const maxFromArr = (arr)=> {
    return arr.reduce((prev,curr)=> Math.max(prev,curr));
}

const minFromArr = (arr)=> {
    return arr.reduce((prev,curr)=> Math.min(prev,curr));
}

exports.minFromArr= minFromArr;
exports.maxFromArr= maxFromArr;
exports.S= S;
exports.R= R;
exports.checkValues= checkValues;
exports.roundDecimals= roundDecimals;
exports.mean= mean;
exports.sumElement= sumElement;
exports.chooseRandomKey= chooseRandomKey;