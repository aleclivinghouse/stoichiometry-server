const Molecule = require('./classes').Molecule;
const ChemEquation= require('./classes').ChemEquation;
const aCoefficent = require('./classes').aCoefficent;
const Side = require('./classes').Side;
// const stringToJSON = require('./stringToJSON').stringToJSON;

const stringToJSON = function(data, weight){
console.log('below is the weight ');
console.log(weight);
let sides = data.split("=");
let leftMolecules = sides[0].split("+");
let rightMolecules = sides[1].split("+");
let coCount = 1;
function sideToJSON(side, weight){
  let arr = [];
   let theSide = new Side();
   for(let molecule of side){

    let capitalRegex = /[A-Z]/;
    let lowerCaseRegex = /[a-z]/;
    let numRegex = /[0-9]/;
    let letter = num2Letter(coCount);
    let theMolecule;
    // for(let weight of weights){
    if(coCount === weight.whichMolecule){
      theMolecule = new Molecule(letter, weight.amount);
      console.log(theMolecule.weight);
    } else {
      theMolecule = new Molecule(letter, null);
      }
    // }

    coCount++;
    let rest = molecule;

    for(let j = 0; j<rest.length; j++){
      //if the char is a capital letter
      if(capitalRegex.test(rest[j]) === true){

        //Capital LowerCase Number Number
        if(lowerCaseRegex.test(rest[j+1]) === true && numRegex.test(rest[j+2]) === true && numRegex.test(rest[j+3]) === true){
          let atom = '';
          let subscript = '';
          atom += rest[j];
          atom += rest[j+1];
          subscript+=rest[j+2];
          subscript+=rest[j+3];
          theMolecule.addAtom(atom, parseInt(subscript));

          //Capital LowerCase Number
        } else if(lowerCaseRegex.test(rest[j+1])===true && numRegex.test(rest[j+2]) === true){
          let atom = '';
          let subscript = '';
          atom += rest[j];
          atom += rest[j+1];
          subscript+=rest[j+2];
          theMolecule.addAtom(atom, parseInt(subscript));

          //Capital Number Number
        } else if(numRegex.test(rest[j+1]) === true && numRegex.test(rest[j+2]) === true){
          let atom = '';
          let subscript = '';
          atom += rest[j];
          subscript += rest[j+1];
          subscript += rest[j+2];
          theMolecule.addAtom(atom, parseInt(subscript));

        //Capital LowerCase
      } else if(lowerCaseRegex.test(rest[j+1])===true){
            let atom = '';
            atom += rest[j];
            atom += rest[j+1];
            theMolecule.addAtom(atom, 1);

            //Capital Number
         } else if(numRegex.test(rest[j+1])===true){
           let atom = '';
           let subscript = '';
           atom+=rest[j];
           subscript+= rest[j+1];
           theMolecule.addAtom(atom, parseInt(subscript));

        //Just a Capital on Its Own
      } else {
           let anAtom = rest[j];
           theMolecule.addAtom(anAtom, 1);
         }
      }
    }
      theSide.addMolecule(theMolecule);
    } //for molecule of side end
    return theSide;
 } //sideToJSON end

 let reactants = sideToJSON(leftMolecules, weight);
 let products = sideToJSON(rightMolecules, weight);
 let equation = new ChemEquation(reactants, products);
 return equation;
}

// console.log(next);



// switch statement
const num2Letter = function(c){
  switch(c){
    case 1: return 'a';
    case 2: return 'b';
    case 3: return 'c';
    case 4: return 'd';
    case 5: return 'e';
    case 6: return 'f';
    case 7: return 'g';
    case 8: return 'h';
    case 9: return 'i';
    case 10: return 'j';
    default: return 0;
  }
}



module.exports = {
  stringToJSON: stringToJSON
}
