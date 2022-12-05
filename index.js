const fs = require('fs')
const {Worker,workerData} = require("worker_threads");
const schedule = require('node-schedule');
const sharp = require("sharp");
var queue =[]


const parsingFunc = (fileName) =>{

    console.log(fileName)
    let worker = new Worker("./convert.js",{workerData:fileName})
    worker.on("message",(val)=>{console.log(val);  })
    worker.on('error',(err)=>{console.log(err); })
    worker.on("exit",(code)=>{console.log(code);} )
    
    }

    const newParsingFunc = ()=>
    {

        if(queue.length>0)
        {
        
        let worker = new Worker("./convert.js",{workerData:queue[0]})
        worker.on("message",(val)=>{console.log(val);  })
        worker.on('error',(err)=>{
            console.log(err); 
            queue.shift();
            newParsingFunc();
        })
        worker.on("exit",(code)=>{
            console.log(code);
        queue.shift()
        newParsingFunc();
        } )
        
        }
        else{console.log('empty queue')}
    }





schedule.scheduleJob('* * * * * *', function(){

    console.log('try')

const apiURL=`https://script.google.com/macros/s/AKfycbynYxl6azm_mQ25A9LSG7ofoUnTo41HVRHc7VOHj5MfHEGEgWcLIHL_7usFt4fBO80x4Q/exec`

fetch(apiURL, { method: "POST", body: "" })
.then((res) => {
 // console.log(res.status);
  //console.log(res)
  return res.text();
})
.then((res) =>{ 
    
    
    

    if(JSON.parse(res).newFilesIds.length>0)
    {

        let ids = JSON.parse(res).newFilesIds
            console.log(ids)
        ids.forEach((x)=>{

            fetch(`${apiURL}?PdfId=${x}`, { method: "POST", body: "" })
.then((res) => {
  console.log(res.status);
  return res.text();
})
.then((resp) =>{

    //console.log(JSON.parse(resp))
    let DataToSave = Buffer.from(JSON.parse(resp).base64PdfStr, 'base64')
    let idStr = JSON.parse(resp).idStr;
    console.log(idStr)
    let files = fs.readdirSync('.')
    if(!files.some((x)=>{return x ==`${idStr.replace(/\_/g,"a")}.pdf`}))
    {
   fs.writeFileSync(`./${idStr.replace(/\_/g,"a")}.pdf`,DataToSave)
   //parsingFunc(`${idStr.replace(/\_/g,"a")}.pdf`)
   if(queue.length==0)
   {
   queue.push(`${idStr.replace(/\_/g,"a")}.pdf`);
   newParsingFunc()
   }
   else{queue.push(`${idStr.replace(/\_/g,"a")}.pdf`)}
}
else{console.log('Already exist')}







})





        })





    }
    else{
        console.log('No New Files')
        console.log(JSON.parse(res).newFilesIds)

    }






}).catch( (err)=> {
    console.log("Unable to fetch -", err);
  });




});