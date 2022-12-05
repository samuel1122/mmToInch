const { parentPort, workerData,Worker } = require('worker_threads')
const fs = require('fs');
const axios = require('axios')
const file = fs.readFileSync(workerData[0]);
const sharp = require("sharp");
var NoOfReq = 0;
console.log('copy To Google Drive')
console.log(workerData)
var data = ''
const process =  require('process'); 
var FileName = workerData[0].split(`.png`)[0].split(`_`)
FileName = FileName[FileName.length-1]
console.log(FileName)
if(FileName.length==1)
{FileName= `00${FileName}.png`}
else if(FileName.length==2)
{
    FileName = `0${FileName}.png`
}
else{FileName= `${FileName}.png`}
console.log(FileName)



const  copyFiles = ()=>
{
let url =`https://script.google.com/macros/s/AKfycbx9PSbHalS9vJE1qbwESAOhgMA-SUVWxW-s7fpDWfTT1sOdCBMblYBTdg2sBDqWKHVEVw/exec`;
    let options = {
        filename: FileName,
        DataStr: data,
        createFolder: false,
        parentFolder: "1C5KLDP1DaHWTKs0XbhcUCb94VE5jFbjE",
        nFName: workerData[1]
    }
    if(FileName=="001.png")
    { options.createFolder=true}
    else {options.createFolder=false}


    axios.post(url, options).then(()=>{
        console.log('SAVED')
        fs.unlinkSync(workerData[0])
        fs.unlinkSync('eng.traineddata')
        process.exit(0)


    
    }).catch(()=>{copyFiles()})



}






sharp(file).flatten({ background: { r: 255, g: 255, b: 255, alpha: 255 } })
.toBuffer().then((val)=>{

    data = val.toString("base64")

    copyFiles()
})


