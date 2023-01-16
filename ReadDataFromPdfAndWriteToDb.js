const fs = require('fs');
const {Client}= require('pg')
const { Poppler } = require("node-poppler");
const { type } = require('os');
const { parse } = require('querystring');
var format = require('pg-format')

var sashesHardwareArr = [['hardwareType','Hardware type'],['hardwareSecurityLevel','Hardware security level'],['handleType','Handle type'],['handleColor','Handle color'],['handleHeight','Handle height'],['specialHinges','Special hinges'],['limiters','Sash vent limiter'],['tiltBlock','Block of the tilt function']]
const poppler = new Poppler();
const pdfFileName = 'OF 2022 001670.pdf'
const file = fs.readFileSync(pdfFileName)
poppler.pdfToText(file).then((text) => {
    //fs.writeFileSync('abc.txt',text);
    console.log(text)
    const autor = text.split('Handled by')[1].split(/\r\n/)[0].trim()
    const quotationNo =parseInt (text.split('Quotation OF/')[1].split('/')[1].split(/\n/)[0].trim())
    let allWindows = text.split('System :');
  

    var sashesHardware =[]
    allWindows = allWindows.map((val,index,arr)=>{

        

        if(!/USD/.test(val))
        {
            return val+arr[index+1].split('USD')[0]+"USD"
        }
        else {return val}
    })
   // console.log(allWindows[3].match(/Windows set .../g)[0])
  // console.log(allWindows[0])
  var setId = []
  var setPartId = []
  var singleWindowId = []
    let sets = allWindows.filter((val,index,arr)=>{


        if(index>0)
        {
            if(arr[index-1].match(/Windows set \d\d\d/g))
            {
                setId.push(arr[index-1].match(/Windows set \d\d\d/g)[0])
                return true;
            
            }

        }
        else
        {return false;}
    })

    let setParts =  allWindows.filter((val,index,arr)=>{


        if(index>0)
        {
          if(arr[index-1].match(/Window \d\d\d\//g))  
          {
            setPartId.push(arr[index-1].match(/Window \d\d\d\/.*/g)[0])
            return true
        }
        if(arr[index-1].match(/Door \d\d\d\//g))  
        {
          setPartId.push(arr[index-1].match(/Door \d\d\d\/.*/g)[0])
          return true
      }
        }
        else
        {return false;}
    })

    let singleWindows = allWindows.filter((val,index,arr)=>{


        if(index>0)
        {

            if( !(arr[index-1].match(/Window \d\d\d\//g)||arr[index-1].match(/Door \d\d\d\//g))&&(arr[index-1].match(/Window \d\d\d/g)||arr[index-1].match(/Door \d\d\d/g)))
            {
               
                if(arr[index-1].match(/Window \d\d\d/g))
                {
                    singleWindowId.push(arr[index-1].match(/Window \d\d\d/g)[0])
                    return true;
                }
                if(arr[index-1].match(/Door \d\d\d/g))
                {
                     singleWindowId.push(arr[index-1].match(/Door \d\d\d/g)[0])
                    return true
                    }

            }
        }
        else
        {return false;}
    })
  //  console.log(singleWindows)
    setParts = setParts.map((val,ixdex)=>{return [val,setPartId[ixdex]]})
    sets = sets.map((val,ixdex)=>{return [val,setId[ixdex]]})
    singleWindows = singleWindows.map((val,ixdex)=>{return [val,singleWindowId[ixdex]]})
//console.log(singleWindows[1])
    singleWindows = singleWindows.map((x)=>
    {
        try{let a= x[0].split(/Glazing\r\n/)[1].split(/\r\n/)[0]}
        catch{'default glazing reading error'}
        
        const defaultGlazing = x[0].split(/Glazing\r\n/)[1].split(/\r\n/)[0]
        const page =x[0];

        
    let type =
    {
        project_id:'',
        system:'',
        typeId:'',
        unitPrice:'',
        UnitWeight:'',
        grille: false,
        Uw:"",
        louver:false,
        limiters:false,
        NailingFin: false,

        no_of_parts:1,
        quotation_No:quotationNo,
        color:'',
        color_code:'',
        autor:autor,
        swisspacer:false,
        sashes:{}
        ,
        dimentions:[{}]
        }
try{
        type.dimentions[0]['width']= x[0].split('Dimensions')[1].split(/\r\n/)[0].trim().split('x')[0].trim()
        type.dimentions[0]['height']= x[0].split('Dimensions')[1].split(/\r\n/)[0].trim().split('x')[0].trim()
}
catch{console.log('dimentions read error')}


 // Sash\r\n
   // Messages\r\n
    //Sash 1\r\n
   // Sash 2\r\n

   try{
    
let sashArr = x[0].split(/Sash\r\n/);
if(sashArr.length==2&&/Messages/.test(x[0]))
{
    type.sashes.sash1= {}
    

   let sashString =sashArr[1].split(/Messages/)[0]
   if(/Fix in frame/.test(sashString))
   { 
 type.sashes.sash1.fixed = true;
   }
   else{type.sashes.sash1.fixed = false;}

   if(/Glazing bead/.test(sashString))
   {
    type.sashes.sash1.glazingBead = sashString.split(/Glazing bead\r\n/)[1].split(/\r\n/)[0].trim();
   }
   else
   {
    type.sashes.sash1.glazingBead="";
   }

try
{
    if(/Glazing bar/.test(sashString))
    {
    type.sashes['sash1']['grille']=sashString.split(/Glazing bar/)[1].split(/Glazing bead/)[0].split(/Fitting/)[0].replace(/\r\n/g," ").trim()
    }
    else{
        type.sashes['sash1']['grille']='';
    }
}

catch{
console.log('grille reading error line 168')
}
type.sashes['sash1']['glazing']=defaultGlazing


try{
if(/Fitting\r\n/.test(sashString))
{
    type.sashes['sash1']['fitting']=sashString.split(/Fitting\r\n/)[1].split(/\r\n/)[0].trim();
}
else
{type.sashes['sash1']['fitting']=''}


}
catch{'fiting read error'}
try{
    let index =page.replace(/price\r\n.*\r\n/,'').split('Glazing').length -1

    type.sashes['sash1']['glazingDimentioins']={};
    type.sashes['sash1']['glazingDimentioins']['width']=page.replace(/price\r\n.*\r\n/,'').split('Glazing')[index].match(/\r\n.* x .*\r\n/g)[0].split(' x')[0].trim()
    type.sashes['sash1']['glazingDimentioins']['height']=page.replace(/price\r\n.*\r\n/,'').split('Glazing')[index].match(/\r\n.* x .*\r\n/g)[0].split('x ')[1].split(/\r\n/)[0].trim()


}
catch
{}


sashesHardwareArr.forEach((val)=>{

let reg = new RegExp(`${val[1]}`)
//let reg = new RegExp(`${val[1]}\\r\\n`)

try
{
if(reg.test(sashString))
{

    type.sashes['sash1'][val[0]]= sashString.split(reg)[1].split(/\r\n/)[0].trim();
}
else
{type.sashes['sash1'][val[0]]=''}
}

catch
{
    console.log(`error `)
}



})

}

   }

catch{console.log('sash data reading error')}


try{
if(x[0].split(/Sash \d\r\n/).length>1)
{
    sashesHardware =[]
    
    for(i=0;i< x[0].split(/Sash \d\r\n/).length-1;i++)
    {
        if(i== x[0].split(/Sash \d\r\n/).length-1)
        {sashesHardware.push(x[0].split(/Sash \d\r\n/)[i+1].split(/Sash \d\r\n/)[0])}
        else{
       sashesHardware.push(x[0].split(/Sash \d\r\n/)[i+1].split(/Messages/)[0])
        }
    }
   
   //type.sashes =sashesHardware
   sashesHardware.forEach((x, index)=>{
    let sashKey =`sash${index+1}`
    type.sashes[sashKey]={}




    try{

        sashesHardwareArr.forEach((val)=>{

            let reg = new RegExp(`${val[1]}`)

            if(reg.test(x))
            {
                type.sashes[sashKey][val[0]]=x.split(reg)[1].split(/\r\n/)[0].trim()
            }
            else{
                type.sashes[sashKey][val[0]]=''
            }


            


        
        
        })




    }

    catch{}



















    

    
    try{
if(/Fix in frame/.test(x))
{
    type.sashes[sashKey]['fixed']=true
}

else{
    type.sashes[sashKey]['fixed']=false
}
    }
    catch{console.log('error reading fixed in frame')}

try{
if(/Glazing bead\r\n/.test(x))
{type.sashes[sashKey]['glazingBead']=x.split(/Glazing bead\r\n/)[1].split(/\r\n/)[0].trim()}
else
{
    type.sashes[sashKey]['glazingBead']=""
}

}
catch{console.log('glazing beed reading error')}
   
try
{
if(/Glazing bar/.test(x))
{type.sashes[sashKey]['grille']=x.split(/Glazing bar/)[1].split(/Glazing bead/)[0].split(/Fitting/)[0].replace(/\r\n/g," ").trim()}
else
{
    type.sashes[sashKey]['grille']=""; 
}
}

catch
{console.log('grille read error line 226')}



try{
if(/Glazing\r\n/.test(x))
{
    type.sashes[sashKey]['glazing']=x.split(/Glazing\r\n/)[1].split(/\r\n/)[0].trim();

}
else{type.sashes[sashKey]['glazing']= defaultGlazing }

}
catch{console.log('glazing read error line 248')}

try{
    if(/Fitting/.test(x))
    {
    type.sashes[sashKey]['fitting']= x.split(/Fitting\r\n/)[1].split(/\r\n/)[0].trim();
    }
    else
    {
        type.sashes[sashKey]['fitting']='' 
    }
}
catch {'fitting read error'}
try{
    let index =page.replace(/price\r\n.*\r\n/,'').split('Glazing').length -1
    type.sashes[sashKey]['glazingDimentioins']={}
    type.sashes[sashKey]['glazingDimentioins']['width']=page.replace(/price\r\n.*\r\n/,'').split('Glazing')[index].match(/\r\n.* x .*\r\n/g)[parseInt(sashKey.split('sash')[1]-1)].split(' x')[0].trim()
    type.sashes[sashKey]['glazingDimentioins']['height']=page.replace(/price\r\n.*\r\n/,'').split('Glazing')[index].match(/\r\n.* x .*\r\n/g)[parseInt(sashKey.split('sash')[1]-1)].split('x ')[1].split(/\r\n/)[0].trim()
}
catch
{}






})




   
}
}
catch
{
console.log('error line 205')
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////       
        try{

            if(/SWISSPACER/.test(x[0]))
            {type.swisspacer =true}

        }
        catch{console.log('spacer extraction error')}
        type.typeId= x[1]
       try{
        
        type.unitPrice = x[0].split("price")[1].split('x')[1].split(/\r\n/)[0].trim().replace(',','')
        
       }
       catch
       {
        console.log('price extraction error')
       }

       if(type.unitPrice=="")
       {
           type.unitPrice= x[0].split("price")[1].split('USD').reverse()[1].split(/\r\n/).reverse()[0].trim().replace(',','')
       }

       try{
        type.system = x[0].split(/\n/)[0].trim();
        
       }
       catch
       {
        console.log('price extraction error')
       }

       try{
        type.UnitWeight = parseFloat(x[0].split('Unit weight')[1].split('Kg')[0].trim())
        
       }
       catch
       {
        console.log('price extraction error')
       }

       try{
        type.Uw = parseFloat(x[0].split('Uw =')[1].split('W')[0].trim());
        
       }
       catch
       {
        console.log('price extraction error')
       }


       type.grille = /Glazing bar/.test(x[0]);
       type.louver=/NO GLASS/.test(x[0]);
       type.NailingFin=/Nailing fin/.test(x[0]);
       type.limiters = /limiter/.test(x[0]);

      

       try{
         type.color = x[0].split(`Colour :`)[1].split(/\r\n/)[0].split('/')[1].trim()
      
    }
    catch{console.log('colorExtractionError')}


    try{
        type.color_code = x[0].split(`Colour :`)[1].split(/\r\n/)[0].split('/')[0].split('.')[1].trim()
     
   }
   catch{console.log('colorExtractionError')}

  

   type.sashes = [type.sashes]
////////////////////////////////////////////////////////////////////////////////
   
       return type;

    })
    //console.log(singleWindows[5].sashes)
    console.log('SINGLE WINDOWS')
    singleWindows.forEach((x)=>{console.log(x.sashes[0])})
    //console.log(singleWindows[1].sashes)
  //  console.log(singleWindows[1])
   // console.log(singleWindows)
  // console.log(setPartId[0])

    setParts= setParts.map((x)=>{
        var pageData =x[0]
        let type =
        {
            project_id:'',
            system:'',
            typeId:'',
            unitPrice:'',
            UnitWeight:'',
            grille: false,
            Uw:"",
            louver:false,
            limiters:false,
            NailingFin: false,
            color:"",
            color_code:'',
            swisspacer:false,
            sashes:{}
            ,
            dimentions:{}
            }
            try{











                try{
        type.dimentions['width']= x[0].split('Dimensions')[1].split(/\r\n/)[0].trim().split('x')[0].trim()
        type.dimentions['height']= x[0].split('Dimensions')[1].split(/\r\n/)[0].trim().split('x')[0].trim()
}
catch{console.log('dimentions read error')}



                
    
                let sashArr = x[0].split(/Sash\r\n/);
                if(sashArr.length==2&&/Messages/.test(x[0]))
                {
                    type.sashes.sash1= {}

                    let sashString =sashArr[1].split(/Messages/)[0]

                   // type.sashes['sash1']['glazingDimentioins']={};
                    //type.sashes['sash1']['glazingDimentioins']['width']='AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
                    //type.sashes['sash1']['glazingDimentioins']['height']='AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

                    sashesHardwareArr.forEach((val)=>{

                        let reg = new RegExp(`${val[1]}`)
                        //let reg = new RegExp(`${val[1]}\\r\\n`)
                        
                        try
                        {
                        if(reg.test(sashString))
                        {
                        
                            type.sashes['sash1'][val[0]]= sashString.split(reg)[1].split(/\r\n/)[0].trim();
                        }
                        else
                        {type.sashes['sash1'][val[0]]=''}
                        }
                        
                        catch
                        {
                            console.log(`error`)
                        }
                        
                        
                        
                        })

                   if(/Fix in frame/.test(sashString))
                   { 
                 type.sashes.sash1.fixed = true;
                   }
                   else{type.sashes.sash1.fixed = false;}
                
                   if(/Glazing bead/.test(sashString))
                   {
                    type.sashes.sash1.glazingBead = sashString.split(/Glazing bead\r\n/)[1].split(/\r\n/)[0].trim();
                   }
                   else
                   {
                    type.sashes.sash1.glazingBead="";
                   }
                
                try
                {
                    if(/Glazing bar/.test(sashString))
                    {
                    type.sashes['sash1']['grille']=sashString.split(/Glazing bar/)[1].split(/Glazing bead/)[0].split(/Fitting/)[0].replace(/\r\n/g," ").trim()
                    }
                    else{
                        type.sashes['sash1']['grille']='';
                    }
                }
                
                catch{
                console.log('grille reading error line 168')
                }

                







                type.sashes['sash1']['glazing']=defaultGlazing;

                //let i =pageData.replace(/price\r\n.*\r\n/,'').split('Glazing').length -1

       




                
                }
                
                   }
                
                catch{console.log('sash data reading error')}


    
    
            type.typeId= x[1]
            try{
                if(x[0].split("price")[1].split())
             type.unitPrice = x[0].split("price")[1].split('x')[1].split(/\r\n/)[0].trim().replace(',','')
             
            }
            catch
            {
              


             console.log('price extraction error')
            }
            if(type.unitPrice=="")
            {
                type.unitPrice= x[0].split("price")[1].split('USD').reverse()[1].split(/\r\n/).reverse()[0].trim().replace(',','')
            }
     
            try{
             type.system = x[0].split(/\n/)[0].trim();
             
            }
            catch
            {
             console.log('price extraction error')
            }
     
            try{
             type.UnitWeight = x[0].split('Unit weight')[1].split('Kg')[0].trim()
             
            }
            catch
            {
             console.log('price extraction error')
            }
     
            try{
             type.Uw = x[0].split('Uw =')[1].split('W')[0].trim();
             
            }
            catch
            {
             console.log('price extraction error')
            }
     
     
            type.grille = /Glazing bar/.test(x[0]);
            type.louver=/NO GLASS/.test(x[0]);
            type.NailingFin=/Nailing fin/.test(x[0]);
            type.limiters = /limiter/.test(x[0]);
     
            
            
            try{
                type.color = x[0].split(`Colour :`)[1].split(/\r\n/)[0].split('/')[1].trim()
             
           }
           catch{console.log('colorExtractionError')}
     
     

           try{
            type.color_code = x[0].split(`Colour :`)[1].split(/\r\n/)[0].split('/')[0].split('.')[1].trim()         
       }
       catch{console.log('colorExtractionError')}

       try{
            
        if(/SWISSPACER/.test(x[0]))
        {type.swisspacer =true}

    }
    catch{console.log('spacer extraction error')}

    try{
if(x[0].split(/Sash \d\r\n/).length>1)
{
    sashesHardware =[]
    
    for(i=0;i< x[0].split(/Sash \d\r\n/).length-1;i++)
    {
        if(i== x[0].split(/Sash \d\r\n/).length-1)
        {sashesHardware.push(x[0].split(/Sash \d\r\n/)[i+1].split(/Sash \d\r\n/)[0])}
        else{
       sashesHardware.push(x[0].split(/Sash \d\r\n/)[i+1].split(/Messages/)[0])
        }
    }
   // console.log(sashesHardware)
   
   //type.sashes =sashesHardware
   sashesHardware.forEach((x, index)=>{
    var sashKey =`sash${index+1}`
    type.sashes[sashKey]={}


    try{
        sashesHardwareArr.forEach((val)=>{

            let reg = new RegExp(`${val[1]}`)
        
            if(reg.test(x))
            {
                type.sashes[sashKey][val[0]]=x.split(reg)[1].split(/\r\n/)[0].trim()
            }
            else{
                type.sashes[sashKey][val[0]]=''
            }
        
        
            
        
        
        
        
        })




    }

    catch{}
    
    
    

    
    try{
if(/Fix in frame/.test(x))
{
    type.sashes[sashKey]['fixed']=true
}

else{
    type.sashes[sashKey]['fixed']=false
}
    }
    catch{console.log('error reading fixed in frame')}

try{
if(/Glazing bead\r\n/.test(x))
{type.sashes[sashKey]['glazingBead']=x.split(/Glazing bead\r\n/)[1].split(/\r\n/)[0].trim()}
else
{
    type.sashes[sashKey]['glazingBead']=""
}

}
catch{console.log('glazing beed reading error')}
   
try
{
if(/Glazing bar/.test(x))
{type.sashes[sashKey]['grille']=x.split(/Glazing bar/)[1].split(/Glazing bead/)[0].split(/Fitting/)[0].replace(/\r\n/g," ").trim()}
else
{
    type.sashes[sashKey]['grille']=""; 
}
}

catch
{console.log('grille read error line 226')}



try{
if(/Glazing\r\n/.test(x))

{
    type.sashes[sashKey]['glazing']=x.split(/Glazing\r\n/)[1].split(/\r\n/)[0].trim();

}
else{type.sashes[sashKey]['glazing']= defaultGlazing 

}

}
catch{console.log('glazing read error line 248')}

//let i =x.replace(/price\r\n.*\r\n/,'').split('Glazing').length -1
   // type.sashes[sashKey]='dfsaaaaaaaaaaaaaa'
   // type.sashes[sashKey]['glazingDimentioins']['width']='ffffffffffffffffffffffffffffffffffffff'//x.replace(/price\r\n.*\r\n/,'').split('Glazing')[1]
   // type.sashes[sashKey]['glazingDimentioins']['height']="sssssssssssssssssssssssssssssssssssssss"//x.replace(/price\r\n.*\r\n/,'').split('Glazing')[1]







})








   
}
}
catch
{
console.log('error line 205')
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EXTRACT SASHES DATA IF MORE THAN ONE --------SET PARTS

var defaultGlazing = x[0].split(/Glazing\r\n/)[1].split(/\r\n/)[0].trim();

try{
    if(x[0].split(/Sash \d\r\n/).length>1)
    {
        sashesHardware =[]
        
        for(i=0;i< x[0].split(/Sash \d\r\n/).length-1;i++)
        {
            if(i== x[0].split(/Sash \d\r\n/).length-1)
            {sashesHardware.push(x[0].split(/Sash \d\r\n/)[i+1].split(/Sash \d\r\n/)[0])}
            else{
           sashesHardware.push(x[0].split(/Sash \d\r\n/)[i+1].split(/Messages/)[0])
            }
        }
       
       //type.sashes =sashesHardware
       sashesHardware.forEach((x, index)=>{
        let sashKey =`sash${index+1}`
      

        let i =pageData.replace(/price\r\n.*\r\n/,'').split('Glazing').length -1
    type.sashes[sashKey]['glazingDimentioins']={}
    type.sashes[sashKey]['glazingDimentioins']['width']=pageData.replace(/price\r\n.*\r\n/,'').split('Glazing')[i].match(/\r\n.* x .*\r\n/g)[parseInt(sashKey.split('sash')[1]-1)].split(' x')[0].trim()
    type.sashes[sashKey]['glazingDimentioins']['height']=pageData.replace(/price\r\n.*\r\n/,'').split('Glazing')[i].match(/\r\n.* x .*\r\n/g)[parseInt(sashKey.split('sash')[1]-1)].split('x ')[1].split(/\r\n/)[0].trim()

       // type.sashes[sashKey]['glazingDimentioins']={};
    //type.sashes[sashKey]['glazingDimentioins']['width']=pageData
    //type.sashes[sashKey]['glazingDimentioins']['height']=pageData





        sashesHardwareArr.forEach((val)=>{

            let reg = new RegExp(`${val[1]}`)
        
            if(reg.test(x))
            {
                type.sashes[sashKey][val[0]]=x.split(reg)[1].split(/\r\n/)[0].trim()
            }
            else{
                type.sashes[sashKey][val[0]]=''
            }
        
        
            
        
        
        
        
        })
        
    
        
        try{
    if(/Fix in frame/.test(x))
    {
        type.sashes[sashKey]['fixed']=true
    }
    
    else{
        type.sashes[sashKey]['fixed']=false
    }
        }
        catch{console.log('error reading fixed in frame')}
    
    try{
    if(/Glazing bead\r\n/.test(x))
    {type.sashes[sashKey]['glazingBead']=x.split(/Glazing bead\r\n/)[1].split(/\r\n/)[0].trim()}
    else
    {
        type.sashes[sashKey]['glazingBead']=""
    }
    
    }
    catch{console.log('glazing beed reading error')}
       
    try
    {
    if(/Glazing bar/.test(x))
    {type.sashes[sashKey]['grille']=x.split(/Glazing bar/)[1].split(/Glazing bead/)[0].split(/Fitting/)[0].replace(/\r\n/g," ").trim()}
    else
    {
        type.sashes[sashKey]['grille']=""; 
    }
    }
    
    catch
    {console.log('grille read error line 226')}
    
    
    
    try{
    if(/Glazing\r\n/.test(x))
    {
        type.sashes[sashKey]['glazing']=x.split(/Glazing\r\n/)[1].split(/\r\n/)[0].trim();
    
    }
    else{type.sashes[sashKey]['glazing']=defaultGlazing
 }
    
    }
    catch{console.log('glazing read error line 248')}
try{
    if(/Fitting/.test(x))
    {
    type.sashes[sashKey]['fitting']= x.split(/Fitting\r\n/)[1].split(/\r\n/)[0].trim();
    }
    else
    {
        type.sashes[sashKey]['fitting']='' 
    }
}
catch {'fitting read error'}
    
    
    
    
    
    
    })
    
    
    
    
       
    }
    }
    catch
    {
    console.log('error line 205')
    }


    
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
     

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////        SINGLE    SASH  PART /////////////////////////////////////////////////////

try{
    
    let sashArr = x[0].split(/Sash\r\n/);
    if(sashArr.length==2&&/Messages/.test(x[0]))
    {
        type.sashes.sash1= {}
let sashString =sashArr[1].split(/Messages/)[0];





//type.sashes['sash1']['glazingDimentions']={a:x}
let i =x[0].replace(/price\r\n.*\r\n/,'').split('Glazing').length -1

type.sashes['sash1']['glazingDimentioins']={};
type.sashes['sash1']['glazingDimentioins']['width']=x[0].replace(/price\r\n.*\r\n/,'').split('Glazing')[i].match(/\r\n.* x .*\r\n/g)[0].split(' x')[0].trim()
type.sashes['sash1']['glazingDimentioins']['height']=x[0].replace(/price\r\n.*\r\n/,'').split('Glazing')[i].match(/\r\n.* x .*\r\n/g)[0].split('x ')[1].split(/\r\n/)[0].trim()


sashesHardwareArr.forEach((val)=>{

    let reg = new RegExp(`${val[1]}`)
    //let reg = new RegExp(`${val[1]}\\r\\n`)
    
    try
    {
    if(reg.test(sashString))
    {
    
        type.sashes['sash1'][val[0]]= sashString.split(reg)[1].split(/\r\n/)[0].trim();
    }
    else
    {type.sashes['sash1'][val[0]]=''}
    }
    
    catch
    {
        console.log(`error `)
    }
    
    
    
    })

        if(/Fitting\r\n/.test(sashString))
        {
       type.sashes['sash1']['fitting']= sashString.split(/Fitting\r\n/)[1].split(/\r\n/)[0].trim();
        }
        else
        {type.sashes['sash1']['fitting']=""}

       if(/Fix in frame/.test(sashString))
       { 
     type.sashes.sash1.fixed = true;
       }
       else{type.sashes.sash1.fixed = false;}
    
       if(/Glazing bead/.test(sashString))
       {
        type.sashes.sash1.glazingBead = sashString.split(/Glazing bead\r\n/)[1].split(/\r\n/)[0].trim();
       }
       else
       {
        type.sashes.sash1.glazingBead="";
       }
    
    try
    {
        if(/Glazing bar/.test(sashString))
        {
        type.sashes['sash1']['grille']=sashString.split(/Glazing bar/)[1].split(/Glazing bead/)[0].split(/Fitting/)[0].replace(/\r\n/g," ").trim()
        }
        else{
            type.sashes['sash1']['grille']='';
        }
    }
    
    catch{
    console.log('grille reading error line 168')
    }
    try{
    type.sashes['sash1']['glazing']=defaultGlazing
    }
    catch{}
    
    }
    
       }
    
    catch{console.log('sash data reading error')}

       

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //----------------------------------------------------------------------------------------------------------------
    
     
            return type;
    
    
    
    
    
    
    
    
    })
    //console.log('SETS')
    //setParts.forEach((x)=>console.log(x.sashes))
//console.log('sets end')
    sets = sets.map((x)=>{

        let type =
        {
            project_id:'',
            typeId:'',
            unitPrice:'',
            UnitWeight:'',

        }

        type.typeId=x[1];
        type.UnitWeight = x[0].split('Unit weight')[1].split('Kg')[0].trim()


        try{
        
            type.unitPrice = x[0].split("price")[1].split('x')[1].split(/\r\n/)[0].trim().replace(',','')
            
           }
           catch
           {
            console.log('price extraction error')
           }


           if(type.unitPrice=="")
           {
               type.unitPrice= x[0].split("price")[1].split('USD').reverse()[1].split(/\r\n/).reverse()[0].trim().replace(',','')
           }




        return type
    
    
    })

//console.log(sets[4])
    var SetSums = [];

    sets.forEach((val) => {
       

        

        let WindowNo = parseInt(val.typeId.split(' ')[2])
        let CurrentSetParts = setParts.filter((x)=>{return parseInt(x.typeId.split(' ')[1].split('/')[0])==WindowNo})
        let weightSum= CurrentSetParts.map((x)=>{return parseFloat(x.UnitWeight) }).reduce((a,b)=>{return a+b})+ parseFloat(val.UnitWeight)
         weightSum =(Math.round(weightSum * 100) / 100)
        let priceSum =CurrentSetParts.map((x)=>{return parseFloat(x.unitPrice)}).reduce((a,b)=>{return a+b})+ parseFloat(val.unitPrice);
        priceSum = (Math.round(priceSum * 100) / 100).toFixed(2);
        let grilleAllParts =CurrentSetParts.map((x)=>{return x.grille}).some((x)=>{return x});
        let louverAll =CurrentSetParts.map((x)=>{return x.louver}).some((x)=>{return x});
        let limitersAll=CurrentSetParts.map((x)=>{return x.limiters}).some((x)=>{return x});
        let UwAll = CurrentSetParts.map((x)=>{return x.Uw}).reduce((a,b)=>{return [a,b]}).flat(30).map((x)=>{return parseFloat(x)}).sort((a,b)=> b-a)[0]
        let NailingFinAll = CurrentSetParts.map((x)=>{return x.NailingFinAll}).some((x)=>{return x});
        let color = CurrentSetParts[0].color
        let colorCode = CurrentSetParts[0].color_code;
        let swisspacer = CurrentSetParts[0].swisspacer
        let sashes = CurrentSetParts.map((x)=>{return x.sashes})
        let dimentions = CurrentSetParts.map((x)=>{return x.dimentions})
/*      s
        system:'',
        typeId:'',
        unitPrice:'',
        UnitWeight:'',
        grille: false,
        Uw:"",
        louver:false,
        limiters:false,
        NailingFin: false,
        glazing:[]
        */
        let type = {

            project_id:'',
            system:CurrentSetParts[0].system,
            typeId: WindowNo,
            unitPrice:priceSum,
            UnitWeight:weightSum,
            grille:grilleAllParts,
            Uw:UwAll,
            louver:louverAll,
            limiters:limitersAll,
            NailingFin:NailingFinAll,
            no_of_parts: CurrentSetParts.length,
            quotation_No:quotationNo,
            color:color,
            color_code: colorCode,
            autor:autor,
            swisspacer:swisspacer,
            sashes:sashes,
            dimentions:dimentions
       
        }
       // console.log(type)
        SetSums.push(type)
        //console.log(type)
        //console.log(priceSum)
        //console.log(weightSum);
        //console.log(WindowNo)
    });
//console.log(setParts[setParts.length-1])
singleWindows= singleWindows.map((x)=>{ x.typeId=parseInt(x.typeId.split(" ")[1]); return x})
//console.log(singleWindows)
//console.log(sets)
var rows = [];
var keys = [];
var keysVar =[];
//console.log(SetSums[0])
const allWindowsArr =[...SetSums,...singleWindows]
//console.log(allWindowsArr)
for (let key in allWindowsArr[0])
{keys.push(key)}
allWindowsArr.forEach((x)=>{
var tableRow =[] 
tableRow =[];
    for (let key in x) {
       // console.log(key, x[key]);
        tableRow.push(x[key])
      }
      rows.push(tableRow)

})
//console.log(keys)
keys= keys.map((x)=>{return `"${x}"`})
keys.forEach((x,index)=>{keysVar.push("$"+`${index+1}`)})


//console.log(keysVar)
//console.log(rows[0])
//console.log(rows[0].length)
//console.log(keysVar.length)
rows = rows.sort((a,b)=> a[2]-b[2])
//console.log(allWindowsArr)
setParts.forEach((y)=>{console.log(y.sashes)})
var reqSend = rows.length

/*
const client = new Client({

    host:"34.27.240.167",
    user:'postgres',
    port:5432,
    password:"",
    database:'postgres'

})
client.connect().then(()=>{
//['','BluEvolution 82',1,'33.55',44.33,true,1.4,true,true,true,['4 ESG/16Ar/4one ESG [Ug=1.0] (24mm)'],true,1670]

    rows.forEach(async (x)=>{



        await client.query(`INSERT INTO window_types (project_id,system,type_id,unit_price,unit_weight,grille,uw,louver,limiters,nailing_fin,no_of_parts,quotation_no,color,color_code,autor,swisspacer,sashes,dimentions) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)` ,x,(err,res)=>{
            if(!err)
        {
            console.log(res.rows)
            console.log(reqSend)
            reqSend = reqSend-1
            console.log(reqSend)
            if(reqSend==0)
            {
                client.end()
            }
        
        }
        else                                                        //,louver,nailing_fin,windows_set
        {
            console.log(reqSend)
            reqSend = reqSend-1
            console.log(reqSend)
            if(reqSend==0)
            {client.end()}
            
            console.log(err.message)
        }
        })

        







    })


   




        
    

    
    
    
    
    
    
    


})




*/


//console.log(allWindowsArr)
})







/* DB conection

*/