const solveFromForm = require('./main').solveFromForm;
const periodicTable = require('./periodicTable').periodicTable;
let weight = {};
let weightTwo = {};
function prettyJSON(obj) { console.log(JSON.stringify(obj, null, 2)); }
weight.amount = 85;
weight.whichMolecule = 1;
weightTwo.amount = 85;
weightTwo.whichMolecule = 2;
let theWeight = [];
theWeight.push(weight);
theWeight.push(weightTwo);
// const equationString = 'B5H9+O2=B2O3+H2O';
const equationString = 'Fe2O3+Al=Al2O3+Fe';
const holyShit = solveFromForm(theWeight, equationString, periodicTable);
console.log('below is holy shit');
console.log(prettyJSON(holyShit));
