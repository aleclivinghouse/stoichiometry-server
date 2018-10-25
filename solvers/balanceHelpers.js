const algebra = require('./algebra.js');
const Fraction = algebra.Fraction;
const Expression = algebra.Expression;
const Equation = algebra.Equation;
const Molecule = require('./classes').Molecule;
const ChemEquation= require('./classes').ChemEquation;
const aCoefficent = require('./classes').aCoefficent;
const Side = require('./classes').Side;

const createCoefficentObjects = function(theMap){
  let lowerCaseRegex = /[a-z]/;
  let equations = Object.values(theMap);
  let str = '';
  let theCoefficents = [];
  for(let equation of equations){
    for(let i = 0; i < equation.length; i++){
      if(lowerCaseRegex.test(equation[i])===true && str.includes(equation[i])===false){
        let coefficent = new aCoefficent(equation[i]);
        theCoefficents.push(coefficent);
        str+=equation[i];
      }
    }
  } //for end
  return theCoefficents;
};

const findFirstLetter = function(theMap){
  let lowerCaseRegex = /[a-z]/;
  let found = false;
  let theLetter;
  let equations = Object.values(theMap);
      for(let equation of equations){
        let letters = [];
         for(let i=0; i < equation.length; i++){
           if(lowerCaseRegex.test(equation[i])===true){
              letters.push(equation[i]);
           }
         }
         // console.log('this is letters length   ' + letters.length);
         if(letters.length === 2){
           theLetter = letters[0];
           found = true;
         }
         // console.log('this is what findFirstLetter is returning');
         // console.log(theLetter);
      } //foreach end
      return theLetter;
}

const setLetterToOne = function(equations, letter){
  // console.log('this is the letter in set letter to one');
  // console.log(letter);
  let lowerCaseRegex = /[a-z]/;
  let numRegex = /[0-9]/;
  let newEquations = [];
  for(let equation of equations){
    // console.log('below is the equation in set letter to one');
    // console.log(equation);
    //1c=2e
    for(let i = 0; i < equation.length; i++){
      if(numRegex.test(equation[i])===true && equation[i+1]===letter && numRegex.test(equation[i+2])===true){
          equation = equation.replace(letter, '*1*');
          // console.log('here is the equation with the one added');
          // console.log(equation);

         newEquations.push(equation);
      } else if(numRegex.test(equation[i])===true && equation[i+1]===letter && numRegex.test(equation[i+2])===false){
          equation = equation.replace(letter, '*1');
          // console.log('here is the equation with the one added');
          // console.log(equation);

      } else if(numRegex.test(equation[i])===false && equation[i+1]===letter && numRegex.test(equation[i+2])===true){
        equation = equation.replace(letter, '1*');
        // console.log('here is the equation with the one added');
        // console.log(equation);
      } else {
        equation.replace(letter, '1');
      }
    }

    newEquations.push(equation);

  }
   return removeDuplicates(newEquations);
}

const setCoefficentObjectOne = function(coefficentObjects, letter){
  for(let object of coefficentObjects){
    if(object.letter === letter){
      object.value = 1;
      object.solved = true;
    }
  }
  return coefficentObjects;
}

const setCoefficentObjectValue = function(coefficentObjects, letter, value){
  for(let object of coefficentObjects){
    if(object.letter === letter){
      object.value = value;
      object.solved = true;
    }
  }
  return coefficentObjects;
}

const setLetterToValue = function(equations, letter, value){
  let lowerCaseRegex = /[a-z]/;
  let numRegex = /[0-9]/;
  let newEquations = [];
  for(equation of equations){
    for(let i = 0; i < equation.length; i++){
      if(numRegex.test(equation[i])===true && equation[i+1]===letter && numRegex.test(equation[i+2])===true){
          equation = equation.replace(letter, '*'+value+'*');
         newEquations.push(equation);
      } else if(numRegex.test(equation[i])===true && equation[i+1]===letter && numRegex.test(equation[i+2])===false){
          equation = equation.replace(letter, '*' + value);
      } else if(numRegex.test(equation[i])===false && equation[i+1]===letter && numRegex.test(equation[i+2])===true){
        equation = equation.replace(letter, value+'*');
      } else {
        equation.replace(letter, value);
      }
    }
    newEquations.push(equation)

  }
   return removeDuplicates(newEquations);
}

const removeDuplicates = function(arr){
    let unique = [...new Set(arr)];
    return unique;
};

const createEquations = function(equation){
   let map1 = createMap(equation.reactants);
   let map2 = createMap(equation.products);
 for(let value in map1){
   map1[value]+= '='+ map2[value];
 }
   return map1;
 }

 const createMap = function(side){
   let map = {};
   for(let molecule of side.molecules){
     let coefficent = molecule.coefficent;
     for(let atom of molecule.atoms){
           if(atom.name.includes('undefined')=== true){
           atom.name = atom.name.substring(0, 1);
            }
       if(!map[atom.name]){
         map[atom.name] = atom.subscript.toString() + coefficent;
       } else {
         map[atom.name] += '+' + atom.subscript.toString() + coefficent;
       }
     }
   }
   return map;
 }



module.exports = {
  createCoefficentObjects: createCoefficentObjects,
  findFirstLetter: findFirstLetter,
  setLetterToOne: setLetterToOne,
  setCoefficentObjectOne: setCoefficentObjectOne,
  setCoefficentObjectValue: setCoefficentObjectValue,
  removeDuplicates: removeDuplicates,
  setLetterToValue: setLetterToValue,
  createEquations: createEquations
}
