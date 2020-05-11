const os = require('os');

const freeMem = os.freemem();
const totalMem = os.totalmem();

console.log(`Free Memory : ${freeMem}, Total Memory: ${totalMem}`)