
try{
const { Poppler } = require("node-poppler");
const fs = require('fs');

const { parentPort, workerData,Worker } = require('worker_threads')
const pdfFileName = workerData;
const file = fs.readFileSync(pdfFileName)

const sharp = require("sharp");

var dimentions = []
    const poppler = new Poppler();
    //const poppler = new Poppler('../../../usr/bin');

    poppler.pdfToText(file).then((text) => {
        let pages = text.split('Handled by');
        //pages.pop();
        var quotationNo =  pages[0].split(`Quotation`)[1].split("/")[2].slice(0,6);
        
       
        console.log('quotationNo')
        console.log(quotationNo);
        pages = pages.slice(0,pages.length-1)
        console.log(pages.length)
        pages.shift();
        var setParts = []
        var SetGrups =[]
        var singleWindows = []
        //let setParts = 

           pages.forEach((val,index) => {
           
           
             if(/ \d\d\d\/\d/.test(val))
             {
                setParts.push([val,index+1])
             }
            });
            //console.log(setParts[0])
            
            setParts = setParts.map((x)=>{
                let width =x[0].split("Dimensions ")[1].split(' mm')[0]
                let heigth =x[0].split("Dimensions ")[1].split('x ')[1].split(' mm')[0]
                x[0]=[width,heigth]
                return x
                
            })
var grup = []       
for(i=0;i<setParts.length;i++)
{
if(i+1==setParts.length)
{ grup.push(setParts[i])
    SetGrups.push(grup)
    grup = []}

else if(setParts[i][1]+1==setParts[i+1][1])
{grup.push(setParts[i])}
else
{
    grup.push(setParts[i])
    SetGrups.push(grup)
    grup = [] 
}


} 
//console.log(SetGrups[0])   

SetGrups= SetGrups.map((x)=>{

    return x.map((y)=>{return y.flat()})
})

console.log(SetGrups)
console.log('SET GRUP')
SetGrups = SetGrups.map((x)=>{
    
    var setSum = x.map((y)=>{return parseInt(y[0])}).reduce((a,b)=>{return a+b})+(x.length-1)*6
    
    var setSumVertical = [...new Set( x.map((y)=>{return parseInt(y[1])}))]
    const vSetSum = setSumVertical.reduce((a,b)=>{return a+b})+(setSumVertical.length-1)*6

    if(setSumVertical.length>1)
    {
        
       

        console.log(vSetSum)

    return [setSum,vSetSum,x[0][2]]

    }

    else
    {
        return [setSum,x[0][1],x[0][2]]

    }


})

singleWindows = pages.map((z,index)=>{return [z,index+2] }).filter((x)=>{
    
    return   !/ \d\d\d\/\d/.test(x[0])&&/Dimensions /.test(x[0])
  
}).map((y)=>{

    let width =y[0].split("Dimensions ")[1].split(' mm')[0]
    let heigth =y[0].split("Dimensions ")[1].split('x ')[1].split(' mm')[0]
    
    return [width,heigth,y[1]]


})
//console.log(singleWindows)

//console.log(SetGrups[0].map((x)=>{return x[0]}).reduce((a,b)=>{return parseInt(a)+parseInt(b)}))
///console.log(SetGrups)
var allWindows = [...singleWindows,...SetGrups].map((x)=>{x[0]=x[0].toString();return x}).sort((a,b)=>{return a[2]-b[2]})
console.log(allWindows)

dimentions= allWindows



        const convertToSvg = (file,val) =>
{
 
    
    const options = {
        firstPageToConvert: dimentions[val][2],
        lastPageToConvert: dimentions[val][2],
        svgFile: true,
    };

    let outputFile =`${pdfFileName.split('.')[0]}_${val+1}.svg`


    poppler.pdfToCairo(file, outputFile, options).then((res) => {

     dimentions[val].push(outputFile)



        if((val+1)<dimentions.length)
        {
        convertToSvg(file, val+1,dimentions)
        }
        else
        {
            dimentions = dimentions.map((x)=>{return [parseInt(x[0]),parseInt(x[1]),x[3]]})

            var filesCounter = 0
            console.log(dimentions)
            const createNewWorker = (val) =>{
            let worker = new Worker("./worker.js",{workerData:[dimentions[val],quotationNo]})

            worker.on('exit',(code)=>{
                console.log('finish')
                filesCounter= filesCounter+1
                if(filesCounter<dimentions.length)
                {createNewWorker(val+1)}
                else
                {
                    console.log('last               file')
                    fs.unlinkSync(pdfFileName);
                }
              
            })
        }
        createNewWorker(0)
            //dimentions[0]
            console.log("lastFileConverted to Svg")

        }
    }).catch((error) => {
    
       



    })





}

convertToSvg(file,0)
console.log('dimentions')
console.log(dimentions)
})

}
catch{console.log('error')}
