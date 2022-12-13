const fs = require('fs');
const trimImage   = require('trim-image')
try{
const { parentPort, workerData,Worker } = require('worker_threads')
fs.unlinkSync(workerData[1])
trimImage(workerData[0],workerData[0])

}
catch{çonsole.log('error')}