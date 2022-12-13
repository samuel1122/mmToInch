const fs = require("fs");
const Tesseract = require("tesseract.js");
const { createWorker } = Tesseract;
const sharp = require("sharp");
const process =  require('process');

const { parentPort, workerData,Worker } = require('worker_threads')
const trimImage   = require('trim-image')

try{









const ConvertDimentionsToInches = (xTotal,yTotal,svgFileName)=>

{


var FILENAME = svgFileName;
var PagePaths= [];
var VerticalpathsXY =[];
var HorisontalPathsXY=[];
var texstsFrom = {}
var Hsums = {}
var Vsums = {}
//var xTotal=2756;
//var yTotal=2807;
var alllongIndex =[]

var NewPaths =[];

var params = [];
var paramsV = [];
var upperBoundX = ""
var upperBoundY = ""
var lowerBoundX =""
var lowerBoundY =""


const readDimentions = ()=>{
   
  const dirReg = new RegExp(FILENAME.split(".")[0])
  const dir = fs.readdirSync(".").filter((x)=>{return dirReg.test(x)&&/jpg/.test(x)});
 
//console.log(dir);


const convert =async (val)=>{
let file = fs.readFileSync(`${dir[val]}`)

const worker = await createWorker();

//console.log(val)
(async () => {

await worker.loadLanguage('eng');
await worker.initialize('eng');
await worker.setParameters({
  tessedit_char_whitelist: '0123456789.',
  langPath: "."
  
});;
  
var { data: { text } } = await worker.recognize(file);
await worker.terminate();
//console.log(text.replace(' ',""));

text = text.replace(/ /g,"").replace(/\n/g,"")

if(text=="0")
{text= "6"}
texstsFrom[dir[val].split('_')[2].split('.')[0]]= text;
console.log(text)

if((val+1)>dir.length)
{await worker.terminate();}

if(val<dir.length-1)
{
convert(val+1)
}
else{
  console.log('last')
  dir.forEach((x)=>{fs.unlinkSync(x)})
  


  HorisontalPathsXY = HorisontalPathsXY.map((x)=>{return [Math.round(x[0]),Math.round(x[1]),texstsFrom[x[2].toString()]]})
  //VerticalpathsXY = VerticalpathsXY.map((x)=>{return[Math.round(x[0]),Math.round(x[1]),x[2]]})
  //console.log(HorisontalPathsXY)
  VerticalpathsXY = VerticalpathsXY.map((x)=>{return [x[0],x[1],texstsFrom[x[2].toString()]]})
  VerticalpathsXY = VerticalpathsXY.map((x)=>{return[Math.round(x[0]),Math.round(x[1]),x[2]]})
  //console.log(VerticalpathsXY);
 // console.log('')
//console.log(VerticalpathsXY)
  let HorisontalPathsXYKeys = [...new Set(HorisontalPathsXY.map((x)=>{return x[1]}))] 
  let VerticalpathsXYKeys =[...new Set(VerticalpathsXY.map((x)=>{return x[0]}))] 
  console.log(`KEYSSSSSSSSSSSSSSSSSSSSSSSSSSS`)
  console.log(VerticalpathsXYKeys)
  console.log(VerticalpathsXY)
  VerticalpathsXYKeys.forEach((x)=>{Vsums[x]=[[],[]]})
  console.log(Vsums)
 // console.log(HorisontalPathsXYKeys)
 
  HorisontalPathsXYKeys.forEach((x)=>{Hsums[x]=[[],[]]})
  //console.log(VerticalpathsXY)
  VerticalpathsXY.forEach((x)=>{Vsums[x[0].toString()][0].push(x[2]);Vsums[x[0].toString()][1].push(x[1])})
  //console.log(Vsums)


  HorisontalPathsXY.forEach((x)=>{Hsums[x[1].toString()][0].push(x[2]);Hsums[x[1].toString()][1].push(x[0])})
  let horisontalArr = []
  let VerticalArr = []
  //console.log(Vsums)
  for(property in Hsums){ horisontalArr.push([property,Hsums[property]])} 
  for(property in Vsums){ VerticalArr.push([property,Vsums[property]])} 
  VerticalArr.forEach((x)=>{console.log(x)})

  VerticalArr = VerticalArr.map((x,index,arr)=>{

    if(x[1][0].length!=x[1][1].length&&index>(arr.length/2))

    {
     
     // x[1][0]=arr[(index/2)][1][0]
      
      x[1][0]=x[1][0].map((y)=>{

        if(y.split(".")[0].length==5)
        {
          return y.slice(0,4)+""+y.slice(4,5)
        }
        else{return y}
      })

      return x
    }
    else{
    
      x[1][0]=x[1][0].map((y)=>{

        if(y.split(".")[0].length==5)
        {
          return y.slice(0,4)+"."+y.slice(4,5)
        }
        else{return y}
      })
      
      return x
    
    
    
    }


  })


  horisontalArr = horisontalArr.map((x,index,arr)=>{

    if(x[1][0].length!=x[1][1].length&&index>(arr.length/2))

    {
     
      x[1][0]=arr[(index/2)][1][0]

      x[1][0]=x[1][0].map((y)=>{

        if(y.split(".")[0].length==5)
        {
          return y.slice(0,4)+"."+y.slice(4,5)
        }
        else{return y}
      })

      return x
    }
    else{
    
      x[1][0]=x[1][0].map((y)=>{

        if(y.split(".")[0].length==5)
        {
          return y.slice(0,4)+"."+y.slice(4,5)
        }
        else{return y}
      })
      
      return x
    
    
    
    }


  })

  //VerticalArr = VerticalArr.map((y)=>{return [y[0],[corectErrors(y[1][0],yTotal),y[1][1]]]})
  //console.log('ÍIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII')
  //VerticalArr.forEach((x)=>{console.log(x)})
  console.log(VerticalArr)
  
  //horisontalArr.forEach((x)=>{console.log(x)})
  
  horisontalArr= horisontalArr.slice((horisontalArr.length/2),horisontalArr.length).map((x)=>{

    x[1][0] = x[1][0].map((y)=>{

      if(y.split('.').length==1&&y.length==5)
      {return y.slice(0,3)+"."+y.slice(3,4)}
      if(parseInt(y)>3000&&x[1][0].length>1)
      {return y.slice(0,3)+"."+y.slice(3,4)}

      else{
        return y
      }
    })
    x[1][0]= corectErrors(x[1][0],xTotal)
    return x

  }).filter((z)=>{return z[1][0].length!=0})
  


  VerticalArr =VerticalArr.map((x)=>{

    x[1][0] = x[1][0].map((y)=>{

      if(y.split('.').length==1&&y.length==5)
      {return y.slice(0,3)+"."+y.slice(3,4)}
      if(parseInt(y)>3000&&x[1][0].length>1)
      {return y.slice(0,3)+"."+y.slice(3,4)}

      else{
        return y
      }
    })
    x[1][0]= corectErrors(x[1][0],yTotal)
    return x

  })
  
  
  
 // console.log("horisontal")
  //horisontalArr.forEach((x)=>{console.log(x)});
  console.log("vertical")
  PagePaths = [PagePaths[1],...PagePaths.slice(alllongIndex[((alllongIndex.length/2))-1],PagePaths.length)]
  VerticalArr=VerticalArr.sort((a,b)=>{return a[1][1][0]-b[1][1][0]}).map((x,index,arr)=>{
    //lowerBoundY = ySort[0]
    //upperBoundY= ySort[ySort.length-1]
  
    //console.log(lowerBoundY)
    if(x[1][0].length!=x[1][1].length&&index>=(arr.length/2))
    {
      x[1][0]= arr[((index+1)/2)-1][1][0]
      return x
    }
    else{return x}

  }).slice(VerticalArr.length/2,VerticalArr.length)
  let ySort = VerticalArr.sort((x,y)=>{return parseInt(y[0])-parseInt(x[0])})
console.log(ySort)
   lowerBoundY = ySort[0][0]
    upperBoundY= ySort[ySort.length-1][0]
    console.log(upperBoundY);
    console.log(lowerBoundY)
  VerticalArr.forEach((x)=>{ console.log(x)});
  console.log('horisontal')
  lowerBoundX =horisontalArr[0][0];
  upperBoundX = horisontalArr[horisontalArr.length-1][0]
  console.log(lowerBoundX)
  console.log(upperBoundX)
  horisontalArr.forEach((x)=>{ console.log(x)});

  
  PagePaths = PagePaths.filter((x)=>{return !/<g /.test(x)&& !/g>/.test(x)||/svg/.test(x)})
///*
for(i=0;i<PagePaths.length;i++)
{
if(/glyph/.test(PagePaths[i]))
{

  PagePaths = [...PagePaths.slice(0,i),`</svg>`]
  break;


}
}
PagePaths= PagePaths.filter((x)=>{return !/100%,0%,0%/.test(x)});

//*/
PagePaths = PagePaths.filter((x)=>{return x.length<600})




VerticalArr.forEach( (x)=>{


  //console.log(x[1][0])

  for(k=0;k<x[1][0].length;k++)
  {
    //console.log(x[1][0][j])
    //console.log([x[1][0][j],x[1][1][j].toFixed(2).toString(),x[0]])
    
    //console.log([x[1][0][k], x[1][1][k].toFixed(2).toString(), x[0]])
    paramsV.push([x[1][0][k],x[0], x[1][1][k].toFixed(2).toString()])
   // console.log([x[1][0][j], x[1][1][j].toFixed(2).toString(), x[0]])
  }

})


paramsV= paramsV.filter((x)=>{return typeof x[1]!="Object"})



.map((x)=>{  return x.map((y)=>{
  return y.toString()
 })})

 horisontalArr.forEach( (x)=>{


  //console.log(x[1][0])

  for(k=0;k<x[1][0].length;k++)
  {
    //console.log(x[1][0][j])
    //console.log([x[1][0][j],x[1][1][j].toFixed(2).toString(),x[0]])
    
  console.log([x[1][0][k], x[1][1][k].toFixed(2).toString(), x[0]])
   params.push([x[1][0][k], x[1][1][k].toFixed(2).toString(), x[0]])
   // console.log([x[1][0][j], x[1][1][j].toFixed(2).toString(), x[0]])
  }

})


params = params.filter((x)=>{return typeof x[1]!="Object"}).map((x)=>{return x.map((y)=>{return y.toString()})})




console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
console.log(params)
//console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB')
//console.log(paramsV)
//process.exit(0)
const generatePathsH = (length, x ,y)=>

{
  length= length.toString();
  x= x.toString();
  y= y.toString();
  
  
  
  
  // x= parseInt(x)+1
  
    const convertMMtoInches =(num)=>
  {
    num=parseFloat(num);
  
    num = num /25.4;
   
    console.log(num)
    
  if(num.toString().split('.').length==1)
  {return num}
  
  else{
  
  if(num<1)
  {
    num = Math.round(num.toFixed(2)*16);
    
    if(num==2)
    {return `1/8`}
  
    if(num==4)
    {return `1/4`}
  
    if(num==6)
    {return `3/8`}
  
    if(num ==8)
  {return `1/2`}
  
  if(num==10)
  {return `5/8`}
  
  if(num==12)
  {return `3/4`}
  
  if(num==14)
  {return `7/8`}
  else
  {return `${num}/16`}
  
  }
  
  else{
  const whole = Math.floor(num);
  const fraction = (num-whole).toFixed(2);
  
  if(Math.round(fraction*32)<1)
  {return whole}
  else
  {
   let num = Math.round(fraction*16)
  
   if(num==2)
    {return `${whole} 1/8`}
  
    if(num==4)
    {return `${whole} 1/4`}
  
    if(num==6)
    {return `${whole} 3/8`}
  
    if(num ==8)
  {return `${whole} 1/2`}
  
  if(num==10)
  {return `${whole} 5/8`}
  
  if(num==12)
  {return `${whole} 3/4`}
  
  if(num==14)
  {return `${whole} 7/8`}
  else
  {

    if(num ==0)
    {return `${whole}` }
    else{
    return `${whole} ${num}/16`
    }
  }
  
  }
  
  
  }
  
  }
  
  
  
  };
  
  
  length = convertMMtoInches(length).toString();
  var inches = ""
  var  nominator =""
  var denominator="";
  console.log(length)
  
  
  
  if(length.split(' ').length==2)
  {
  inches = length.split(" ")[0];
  nominator =length.split(" ")[1].split("/")[0]
  denominator =length.split(" ")[1].split("/")[1]
  }
  
  if(length.split(' ').length==1)
  
  {
  if(length.split("/").length==1)
  {
    
  inches= length.toString();
  nominator = "";
  denominator = "";
  }
  else{
  
    inches=""
    nominator=length.split('/')[0].toString()
    denominator=length.split('/')[1].toString()
  }
  
  
  
  }
  
  if(nominator!=""&& nominator==denominator)
  {
  if(inches=="")
  {inches="0"}
  
  
  inches= (parseInt(inches)+1).toString()
  nominator=""
  denominator=""
  }
  
  
  //console.log('Y VAL')
  //console.log(y)
  //console.log('upperBound')
  //console.log(upperBoundX)
  //console.log('lowerBound')
  //console.log(lowerBoundX)
  if(upperBoundX==lowerBoundX)
  {
    y = parseFloat(y)+3 
  }
  else if(Math.abs(y-lowerBoundX)>Math.abs(y-upperBoundX))
  {y = parseFloat(y)+3}  //Bottom Dimentions
  
  else{y = parseFloat(y)+4}
  
  const RenderFraction = (whole,nominator,denominator)=>
  {
  
      var newPath = "";
   if(nominator!="")
   {
  var wholeLength = whole.length*6.7;
  var wholeFractionSpace =1.6;
  var fractionLine =3.3
  if(nominator.length>1||denominator.length>1)
  {fractionLine=6.6
  
  }
  var tickPosition = wholeLength+ wholeFractionSpace+fractionLine+1;
  var fractionPositionStart = wholeLength +wholeFractionSpace;
  var fractionEnd = wholeLength+ wholeFractionSpace+fractionLine;
  var recLength = wholeLength+wholeFractionSpace+fractionLine+4.5+1
  if(whole=="")
  {
      tickPosition = fractionLine+1;
      fractionPositionStart = 0;
      fractionEnd = fractionLine;
      recLength = fractionLine+1+4.5
  
  }
   
  newPath = `
  <g transform=" translate(${x-(recLength/3.4)} ${y}) scale(0.5 0.75)">  
  <rect x="0" y="-10" width="${recLength+0.5}" height="11.5" fill="white"></rect>
  <text x="0.5" y="0" class="inches">${whole}</text>
  <text x="${fractionPositionStart+0.5}" y="-5.5" class="fraction">${nominator}</text>
  <text x="${fractionPositionStart+0.5}" y="1.3" class="fraction">${denominator}</text>
  <text x="${tickPosition+0.5}" y="-2" class="tick">"</text>
    <line x1="${fractionPositionStart+0.5}" y1="-4.3" x2="${fractionEnd+1}" y2="-4.3" stroke="black" stroke-width="0.1" />
    </g>
    `
  //console.log(string)
  }
  else
  {   
      var wholeLength = whole.length*6.7;
      var recLength =wholeLength+1+4.5;
      var tickPosition = wholeLength+1;
      newPath =`<g transform=" translate(${x-(recLength/3.4)} ${y}) scale(0.5 0.75)"> 
      <rect x="0" y="-10" width="${recLength+0.5}" height="11.5" fill="white"></rect>
                   <text x="0.5" y="0" class="inches">${whole}</text>
                   <text x="${tickPosition+0.5}" y="-2" class="tick">"</text>
                   </g>`
                   //console.log(string)
  }
  
  NewPaths.push(newPath) 
  
  
  }
  RenderFraction(inches,nominator,denominator)


}

const generetePahtsV = (length, x ,y)=>

{
  length= length.toString();
  x= x.toString();
  y= y.toString();
  
  
  
  
  // x= parseInt(x)+1
  
    const convertMMtoInches =(num)=>
  {
    num=parseFloat(num);
  
    num = num /25.4;
   
    console.log(num)
    
  if(num.toString().split('.').length==1)
  {return num}
  
  else{
  
  if(num<1)
  {
    num = Math.round(num.toFixed(2)*16);
    
    if(num==2)
    {return `1/8`}
  
    if(num==4)
    {return `1/4`}
  
    if(num==6)
    {return `3/8`}
  
    if(num ==8)
  {return `1/2`}
  
  if(num==10)
  {return `5/8`}
  
  if(num==12)
  {return `3/4`}
  
  if(num==14)
  {return `7/8`}
  else
  
  {
    if(num==0)
    {return num.toString()}
    else{
    return `${num}/16`
  
    }
  
  }
  
  }
  
  else{
  const whole = Math.floor(num);
  const fraction = (num-whole).toFixed(2);
  
  if(Math.round(fraction*32)<1)
  {return whole}
  else
  {
   let num = Math.round(fraction*16)
  
   if(num==2)
    {return `${whole} 1/8`}
  
    if(num==4)
    {return `${whole} 1/4`}
  
    if(num==6)
    {return `${whole} 3/8`}
  
    if(num ==8)
  {return `${whole} 1/2`}
  
  if(num==10)
  {return `${whole} 5/8`}
  
  if(num==12)
  {return `${whole} 3/4`}
  
  if(num==14)
  {return `${whole} 7/8`}
  else
  {
    if(num==0)
    {return num.toString()}
    else{
    return `${whole} ${num}/16`}
    }
  }
  
  
  }
  
  }
  
  
  
  };
  
  
  length = convertMMtoInches(length).toString();
  var inches = ""
  var  nominator =""
  var denominator="";
  console.log(length)
  
  
  
  if(length.split(' ').length==2)
  {
  inches = length.split(" ")[0];
  nominator =length.split(" ")[1].split("/")[0]
  denominator =length.split(" ")[1].split("/")[1]
  }
  
  if(length.split(' ').length==1)
  
  {
  if(length.split("/").length==1)
  {
    
  inches= length.toString();
  nominator = "";
  denominator = "";
  }
  else{
  
    inches=""
    nominator=length.split('/')[0].toString()
    denominator=length.split('/')[1].toString()
  }
  
  
  
  }
  
  if(nominator!=""&& nominator==denominator)
  {
  if(inches=="")
  {inches="0"}
  
  
  inches= (parseInt(inches)+1).toString()
  nominator=""
  denominator=""
  }
  
  
  //console.log('Y VAL')
  //console.log(y)
  //console.log('upperBound')
  //console.log(upperBoundX)
  //console.log('lowerBound')
  //console.log(lowerBoundX)
  if(upperBoundY==lowerBoundY)
  {
    x = parseFloat(x) 
  }
  else if(Math.abs(x-lowerBoundY)>Math.abs(x-upperBoundY))
  {x = parseFloat(x)-4}  
  
  else{x = parseFloat(x)}
  
  const RenderFraction = (whole,nominator,denominator)=>
  {
  
      var newPath = "";
   if(nominator!=""&&nominator.toString!="0")
   {
  var wholeLength = whole.length*6.7;
  var wholeFractionSpace =1.6;
  var fractionLine =3.3
  if(nominator.length>1||denominator.length>1)
  {fractionLine=6.6
  
  }
  var tickPosition = wholeLength+ wholeFractionSpace+fractionLine+1;
  var fractionPositionStart = wholeLength +wholeFractionSpace;
  var fractionEnd = wholeLength+ wholeFractionSpace+fractionLine;
  var recLength = wholeLength+wholeFractionSpace+fractionLine+4.5+1
  if(whole=="")
  {
      tickPosition = fractionLine+1;
      fractionPositionStart = 0;
      fractionEnd = fractionLine;
      recLength = fractionLine+1+4.5
  
  }

   
  newPath = `
  <g transform=" translate(${x} ${(parseFloat(y)+2.68)}) scale (0.4 0.7)">  
  <rect x="0" y="-10" width="${recLength+0.5}" height="11.5" fill="white"></rect>
  <text x="0.5" y="0" class="inches">${whole}</text>
  <text x="${fractionPositionStart+0.5}" y="-5.5" class="fraction">${nominator}</text>
  <text x="${fractionPositionStart+0.5}" y="1.3" class="fraction">${denominator}</text>
  <text x="${tickPosition+0.5}" y="-2" class="tick">"</text>
    <line x1="${fractionPositionStart+0.5}" y1="-4.3" x2="${fractionEnd+1}" y2="-4.3" stroke="black" stroke-width="0.1" />
    </g>
    `
  //console.log(string)
  }
  else
  {   
      var wholeLength = whole.length*6.7;
      var recLength =wholeLength+1+4.5;
      var tickPosition = wholeLength+1;
      newPath =`<g transform=" translate(${x} ${(parseFloat(y)+2.68)}) scale (0.4 0.7)"> 
      <rect x="0" y="-10" width="${recLength+0.5}" height="11.5" fill="white"></rect>
                   <text x="0.5" y="0" class="inches">${whole}</text>
                   <text x="${tickPosition+0.5}" y="-2" class="tick">"</text>
                   </g>`
                   //console.log(string)
  }
  
  NewPaths.push(newPath) 
  
  
  }
  RenderFraction(inches,nominator,denominator)


}

//paramsV= paramsV.filter((x)=>{return parseFloat(x[0])>230})

for(k=0;k<params.length;k++)
{
  generatePathsH(...params[k])
}

for(k=0;k<paramsV.length;k++)
{
  generetePahtsV(...paramsV[k])
}
let style = `<style>
.inches{
  font:  12px Arial;}
.fraction {
  font:  6px Arial;}
.tick {
    font:10px Arial;}
    .tempered {
      font:  25px Arial;
      fill:black;
    }
    
</style>`



        var windowPathsEndIndex ="11"
        for(i=PagePaths.length-1;i>=0;i--)
        {
          if(/style="fill-rule:evenodd;fill:rgb/.test(PagePaths[i]))
          {
            windowPathsEndIndex =i;
            break;
          }
}
          console.log('INDEX INDEX INDEX INDEX INDEX INDEX')
          console.log(windowPathsEndIndex)





     var louverPaths = []
     for(i=PagePaths.length-1;i>=0;i--)
     {
     
     if(/\(74.598694%,100%,100%/.test(PagePaths[i]))
     {
     
         louverPaths.push(PagePaths[i].replace(/rgb.*;/,`rgb(100%,100%,100%);`))
         let pointsArr = PagePaths[i].split(`d="`)[1].toUpperCase().replace(/M/g,"").replace(/L/g,"").split('Z')[0].split(' ').filter((x)=>{return x!=''}).map((x)=>{return parseFloat(x)})
         const marginTopBottom =4
         const marginleftRight =4
         const partHeigth =3
         let louverHeigth = pointsArr[1]-pointsArr[5] -(2*marginTopBottom)
         let numberOfparts =Math.floor(louverHeigth/partHeigth)
         const LineLeft=`<line x1="${pointsArr[0]+marginleftRight}" y1="${pointsArr[1]-marginTopBottom}" x2="${pointsArr[6]+marginleftRight}" y2="${pointsArr[7]+marginTopBottom}" stroke="black" stroke-width= "0.2"/>`
         const LineRight=`<line x1="${pointsArr[2]-marginleftRight}" y1="${pointsArr[3]-marginTopBottom}" x2="${pointsArr[4]-marginleftRight}" y2="${pointsArr[5]+marginTopBottom}" stroke="black" stroke-width= "0.2"/>`
         const LineTop = `<line x1="${pointsArr[6]+marginleftRight}" y1="${pointsArr[7]+marginTopBottom}" x2="${pointsArr[4]-marginleftRight}" y2="${pointsArr[5]+marginTopBottom}" stroke="black" stroke-width= "0.2"/>`
         const LineBottom = `<line x1="${pointsArr[0]+marginleftRight}" y1="${pointsArr[1]-marginTopBottom}" x2="${pointsArr[2]-marginleftRight}" y2="${pointsArr[3]-marginTopBottom}" stroke="black" stroke-width= "0.2"/>`
         louverPaths.push(LineLeft)
         louverPaths.push(LineRight)
         louverPaths.push(LineTop)
         louverPaths.push(LineBottom)
     
         for(j=1;j<=numberOfparts;j++)
         {
             let yOffset= j*partHeigth
             let part =`<line x1="${pointsArr[6]+marginleftRight}" y1="${pointsArr[7]+marginTopBottom+yOffset}" x2="${pointsArr[4]-marginleftRight}" y2="${pointsArr[5]+marginTopBottom+yOffset}" stroke="black" stroke-width= "0.2"/>`
             louverPaths.push(part)
             //console.log(part)
         }
     
         //console.log(numberOfparts)
         //console.log(louverHeigth)
         console.log(louverPaths)
         PagePaths[i+1]=""
         PagePaths[i]=louverPaths.join(' ')
         
         
     }
     
     }

     let laminated = PagePaths.filter((x)=>{
      return /fill:rgb\(75.39978%,75.39978%,75.39978%\)/.test(x)
    }).map((y)=>{
      if(y.split(`d="M `)[1].split('M').length==2)
      {
      let ySplit= y.split(`d="M `)[1].split(' ')
      let xCo = parseFloat(ySplit[ySplit.length-3])+3.5
      let yCo =parseFloat(ySplit[ySplit.length-2])-16
  
      let pathString = `
      <g transform=" translate(${xCo} ${yCo}) scale (0.24)">
      <circle cx="27" cy="25" r="20" style="fill:white" stroke="black" stroke-width="2"/>
  
     
       <text x="19" y="34" class="tempered">L</text>
       </g>
       `
       return pathString
      }
      if(y.split(`d="M `)[1].split('M').length>2)
      {

        let pathSubStr = y.split(`d="M `)[1].split('M');
pathSubStr = pathSubStr.slice(0 ,pathSubStr.length-1)
pathSubStr= pathSubStr.map((a)=>{let dim = a.split(' ').filter((b)=>{return b.length>1}) ;return [dim[dim.length-2],dim[dim.length-1]]})
pathSubStr= pathSubStr.map((x)=>{

    let xCo =parseFloat(x[0])+3.5
    let yCo =parseFloat(x[1])-16

    let pathString = `
      <g transform=" translate(${xCo} ${yCo}) scale (0.24)">
      <circle cx="27" cy="25" r="20" style="fill:white" stroke="black" stroke-width="2"/>
  
     
       <text x="19" y="34" class="tempered">L</text>
       </g>
       `
       return pathString
})
pathSubStr=pathSubStr.join(' ')
return pathSubStr

      }
      
   
  
      
    })


     let tempered = PagePaths.filter((x)=>{
      return /fill:rgb\(88.299561%,88.299561%,88.299561%\)/.test(x)
    }).map((y)=>{
      if(y.split(`d="M `)[1].split('M').length==2)
      {
      let ySplit= y.split(`d="M `)[1].split(' ')
      let xCo = parseFloat(ySplit[ySplit.length-3])+3.5
      let yCo =parseFloat(ySplit[ySplit.length-2])-16
  
      let pathString = `
      <g transform=" translate(${xCo} ${yCo}) scale (0.24)">
      <circle cx="27" cy="25" r="20" style="fill:white" stroke="black" stroke-width="2"/>
  
     
       <text x="19" y="34" class="tempered">T</text>
       </g>
       `
       return pathString
      }
      if(y.split(`d="M `)[1].split('M').length>2)
      {

        let pathSubStr = y.split(`d="M `)[1].split('M');
pathSubStr = pathSubStr.slice(0 ,pathSubStr.length-1)
pathSubStr= pathSubStr.map((a)=>{let dim = a.split(' ').filter((b)=>{return b.length>1}) ;return [dim[dim.length-2],dim[dim.length-1]]})
pathSubStr= pathSubStr.map((x)=>{

    let xCo =parseFloat(x[0])+3.5
    let yCo =parseFloat(x[1])-16

    let pathString = `
      <g transform=" translate(${xCo} ${yCo}) scale (0.24)">
      <circle cx="27" cy="25" r="20" style="fill:white" stroke="black" stroke-width="2"/>
  
     
       <text x="19" y="34" class="tempered">T</text>
       </g>
       `
       return pathString
})
pathSubStr=pathSubStr.join(' ')
return pathSubStr

      }
      
   
  
      
    })


    console.log(laminated)
    //78.49884%,78.49884%,78.49884% grey arows
    //PagePaths = PagePaths.filter((x)=>{return !/78.49884%,78.49884%,78.49884%/.test(x)})

     let converted = [PagePaths[0],PagePaths[1],style,...PagePaths.slice(1,PagePaths.length-1),...NewPaths,...tempered,...laminated,`</svg>`].join("   ")
console.log(converted)
//fs.writeFileSync(`converted${svgFileName}`,converted);
     sharp(Buffer.from(converted)).resize(heigth=3000,width=3000, 
      {
        fit: 'outside',
      } ).png().toFile(`${svgFileName.split(`.`)[0]}.png`).then(()=>{



        let worker = new Worker("./trim.js",{workerData:[`${svgFileName.split(`.`)[0]}.png`,svgFileName]})

        worker.on('exit',(code)=>{

          let workerb = new Worker(`./copyToGoogleDrive`,{workerData:[`${svgFileName.split(`.`)[0]}.png`,workerData[1]]})
            

          workerb.on('exit',()=>{ process.exit(0)})

           

        }

        )



        

      


        

      })


//fs.writeFileSync(svgFileName,converted)
       
//console.log(NewPaths)









  






}
})();

  }
  convert(0)
  }






const corectErrors = (arr,length) => 

  
{

  
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
  if(isNaN(length))
  {return arr}
if(arr.length==1&&arr[0].replace(/\W/g,"").length==1)
{return []}
if(arr.length==2&&arr[0].replace(/\W/g,"").length==1&&arr[1].replace(/\W/g,"").length==1)
{return[]}
  
  

let initialsum = arr.reduce((x,y)=>{return parseFloat(x)+parseFloat(y)})

if(Math.round(initialsum)==length||Math.round(initialsum)==length-1||Math.round(initialsum)==length+1)
{return arr}

//if(arr.length==1)
//{
  //return [length.toString()]
//}
//if(arr.length==2)
  //{
   // if(arr.some((x=>{return Math.round(parseFloat(x)*2)==length})))
   // return [ (length/2).toString(),(length/2).toString()]
  //}

  //if(arr.length==3&&arr[0]==arr[2]&&(length-(parseFloat(arr[0])+parseFloat(arr[2])))<100)
  //{
   // let dif =  Math.round(length -parseFloat(arr[0])-parseFloat(arr[2])).toString()
   // return [arr[0],dif,arr[2]]
  
  //}

    var arrString = arr.join(' ').split("");

    var noOfOs = 0;
    var Oindexes =[];
    var combinations= [];
    
    for(i=0;i<arrString.length;i++)
    {
    
        if(arrString[i]=="0")
    
        {
        noOfOs = noOfOs+1;
        Oindexes.push(i)
        }
    }
    
    let noOfCombinations =4**noOfOs
    //console.log(noOfOs)
    //console.log(Oindexes);
    //console.log(noOfCombinations)
    
    for(i=0;i<noOfCombinations;i++)
    {
    var base3String = i.toString("4").replace(/1/g,"6").replace(/2/g,"9").replace(/3/g,"x");
    //console.log(base3String);
    //console.log(base3String)
    
    for(j=0;j<base3String.length;j++)
    
    {
      
      
        let index = parseInt(Oindexes[Oindexes.length-1-j]);
       // console.log("index")
        //console.log(j)
        arrString[index]=base3String[base3String.length-1-j].toString()
        //console.log(arrString[index]);
        
        
      // console.log(base3String[base3String.length-1-j]);
    }
    const variant = arrString.join('').split(" ").map((x)=>{return parseFloat(x.replace("x",""))})
    const sum = Math.round(variant.reduce((a,b)=>{return a+b}))
    if(sum == length&&!variant.some((x)=>{x==""})&&!variant.some((x)=>{x=="1"}))
    {combinations.push(variant)}
    
    
    }
    if(combinations.length>1)
    
    {
      let a = combinations.filter((x)=>{let b = new Set(x); return [...b].join("")!=x.join("")})
      if(a.length>0)
      {
      return a[0].map((y)=>{return y.toString()})
      }
      else
      {return combinations[0]}
    }
    if(combinations.length==0)
    {return arr}

    else{
    return combinations[0].map((x)=>{return x.toString()})
        
    }

}

const converPagetToInches = (filename)=>{

   


    const DeleteDef = (val)=>

    {

        for(i=val.length-1;i>-0;i--)

        {
            
            if(/defs/.test(val[i]))

            {
                return [val[0],val[1],...val.slice(i+1,val.length)]
            }
        }
    }

    const cropText = (val)=>{
    
        let image = val;
        image = image.replace(/xlink".*viewBox/,`xlink" viewBox`)
        
        let paths = image.split(`d="`)[1].split(`"/`)[0].replace(/([a-zA-Z])/g, "").split(' ')
         paths = paths.filter(((x)=>{return x!=""})).map((x)=>{return parseFloat(x)})
        var x = []
        var y =[]
    
        
        
        for(j=0;j<paths.length;j++)
        {
        if(j%2==0)
        {
        x.push(paths[j])
        }
        else{y.push(paths[j])}
        }
        
        x= x.sort((a,b)=>{return a-b})
        y= y.sort((a,b)=>{return a-b})
        //console.log(x)
        //console.log(y)
        
        image = image .replace(/viewBox=".*" version/,`viewBox="${x[0]*0.999} ${y[0]*0.9995} ${(x[x.length-1]-x[0])*1.1} ${(y[y.length-1]-y[0])*1.1}" version`)
        return image
        }
        const allPaths = DeleteDef(fs.readFileSync(`${filename}`,"utf8").split(/\n/))




     PagePaths = [...new Set(allPaths)].filter((x)=>{return !/" stroke:none;fill-rule:nonzero;fill:rgb\(100%,100%,100%/.test(x)});
     
     for(l=0;l<PagePaths.length;l++)
     {
       if(/78.49884%,78.49884%,78.49884%/.test(PagePaths[l]))
       {
         for(j=l;j<l+15;j++)
         {
          if(/78.49884%,78.49884%,78.49884%/.test(PagePaths[j]))
          {
            PagePaths[j]="";
          }
          if(PagePaths[j].length>700&&!/100%,0%,0%/.test(PagePaths[j]))
          {
            PagePaths[j]='';
           break
          }
         }
     
       }
     }
     
     
     
     //DeleteDef(fs.readFileSync(`${filename}`,"utf8").split(/\n/));



var jpgPaths = []
    console.log(PagePaths[PagePaths.length-2])

    
for(i=0;i<PagePaths.length;i++){
  //console.log(val)
  if(PagePaths[i].length>700&&!/100%,0%,0%/.test(PagePaths[i]))


  {
    //console.log('long')
    //console.log(val)
    //console.log(PagePaths[val])
      let croped = cropText([PagePaths[1],PagePaths[i],PagePaths[PagePaths.length-2]].join(''));
      //console.log(croped)
     

      let cropedViewBox = croped.split(`viewBox="`)[1].split(`" version`)[0];
      let cropedHigth = parseFloat(cropedViewBox.split(' ')[3])
      let cropedWidth = parseFloat(cropedViewBox.split(' ')[2])
      let yCo = parseFloat(cropedViewBox.split(' ')[1])
      let xCo = parseFloat(cropedViewBox.split(' ')[0])
      let yMidPoint = yCo +(cropedHigth/2)
      let xMidPoint = xCo +(cropedWidth/2)
      console.log(Math.round(cropedHigth))
      console.log(Math.round(cropedWidth))
      if(Math.round(cropedHigth)!=4)
      {
        if((Math.round(cropedHigth)<7))
        {
          jpgPaths.push([croped,i,true])
          PagePaths[i]=""
          
            VerticalpathsXY.push([xCo,yMidPoint,i]) 
            alllongIndex.push(i)  

        }


          else if(!(Math.round(cropedWidth)==9)&&(Math.round(cropedHigth)>9))
          {
            jpgPaths.push([croped,i,true])
            PagePaths[i]=""
            
              VerticalpathsXY.push([xCo,yMidPoint,i]) 
              alllongIndex.push(i)  

     
          }
          else  if(!(Math.round(cropedWidth)==9)&&!(Math.round(cropedHigth)>9))
          {
            jpgPaths.push([croped,i,false])
            PagePaths[i]=''
            HorisontalPathsXY.push([xMidPoint,yMidPoint,i]) 
            alllongIndex.push(i)  

          
     
          }
      }
     




      
  }
}
//console.log(jpgPaths)


const convertToJpg = (val)=>
{
  console.log('itirator')
  console.log(val)

  if(jpgPaths[val][2]!=false)
  {
  sharp(Buffer.from(jpgPaths[val][0])).resize(heigth=30,width=30, 
    {
      fit: 'outside',
    } ).extend({
      top: 6,
      bottom: 6,
      left: 6,
      right: 6,
      background: { r: 1, g: 1, b: 1, alpha: 0 }
    }).png().rotate(90).flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } }).toFile(`${filename.split('.svg')[0]}_${jpgPaths[val][1]}.jpg`).then(()=>{
      if(val+1<jpgPaths.length)
      {
        convertToJpg(val+1)
      }
      else{
        console.log('lastFileConverted')
      }

    })

  }

  else
  
  {

    sharp(Buffer.from(jpgPaths[val][0])).resize(heigth=30,width=30, 
      {
        fit: 'outside',
      } ).extend({
        top: 6,
        bottom: 6,
        left: 6,
        right: 6,
        background: { r: 1, g: 1, b: 1, alpha: 0 }
      }).png().flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } }).toFile(`${filename.split('.svg')[0]}_${jpgPaths[val][1]}.jpg`).then(()=>{
        if(val+1<jpgPaths.length)
        {
          convertToJpg(val+1)
        }
        else{
          console.log('lastFileConverted')
          readDimentions()
        }
  
      })
  }

}

convertToJpg(0)

 

 

  
 
       
    

}
converPagetToInches(svgFileName)





}

ConvertDimentionsToInches(  ...workerData[0]  )

}
catch{
  console.log('error')
  process.exit(0)
}