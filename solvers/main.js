//first replace a with 1
//then find an equation with only one other letter and solve for that letter
//then if one of the other equations contains the letter/ replace it with the answer
const algebra = require('./algebra.js');
const Fraction = algebra.Fraction;
const Expression = algebra.Expression;
const Equation = algebra.Equation;
const periodicTable = require('./periodicTable').periodicTable;
const Molecule = require('./classes').Molecule;
const ChemEquation= require('./classes').ChemEquation;
const aCoefficent = require('./classes').aCoefficent;
const Side = require('./classes').Side;
const stringToJSON = require('./stringToJSON').stringToJSON;
const createCoefficentObjects = require('./balanceHelpers').createCoefficentObjects;
const findFirstLetter = require('./balanceHelpers').findFirstLetter;
const setLetterToOne = require('./balanceHelpers').setLetterToOne;
const setLetterToValue = require('./balanceHelpers').setLetterToValue;
const setCoefficentObjectOne = require('./balanceHelpers').setCoefficentObjectOne;
const setCoefficentObjectValue = require('./balanceHelpers').setCoefficentObjectValue;
const removeDuplicates = require('./balanceHelpers').removeDuplicates;
const createEquations = require('./balanceHelpers').createEquations;

///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

const balance = function(map){
  // console.log('this is the map coming into balance');
  // console.log(map);
 let coefficentObjects = createCoefficentObjects(map);
 // console.log('these are the coefficent obhects');
 // console.log(coefficentObjects);
 let values = Object.values(map);
 // console.log('these are the values that go into find first letter');
 // console.log(values);
 let firstLetter = findFirstLetter(map);
 // console.log('this is first letter');
 // console.log(firstLetter);
 let equationsToSolve = setLetterToOne(values, firstLetter);
 // console.log('this is equations to solve');
 // console.log(equationsToSolve);
 let newCoefficentObjects = setCoefficentObjectOne(coefficentObjects, firstLetter);
 let i = 0;
 let final = balanceRest(newCoefficentObjects, equationsToSolve, i);
 return final;
}//balance end

const balanceRest = function(theCoefficentObjects, theEquationsToSolve, i){
  if(i === theCoefficentObjects.length -1){
    return theCoefficentObjects;
  }
 // this SHOULD Return and equation
  // console.log('below are the equations to solve');
  // console.log(theEquationsToSolve);
   equationToSolveNext = solveNext(theEquationsToSolve);
   // console.log('this is the equation to solve next ');
   // console.log(equationToSolveNext);
   let answer = solve(equationToSolveNext);
   let coefficentObjects2 = setCoefficentObjectValue(theCoefficentObjects, answer.letter, answer.value);
   let equationsToSolve2 = setLetterToValue(theEquationsToSolve, answer.letter, answer.value);
   return balanceRest(coefficentObjects2, equationsToSolve2, i+1);
} //balance rest end

const finalValues = function(map, theLCM){
  // console.log('this is theLCM coming into final values');
  // console.log(theLCM);
   let arr = [];
  for(let thing of map){
    let str = '';
    str += thing.value;
    if(str.length > 1){
      let strArr = str.split('/');
      let fract = new Fraction(parseInt(strArr[0]),parseInt(strArr[1]));
      arr.push(fract * theLCM);
    } else{
      arr.push(parseInt(thing.value) * parseInt(theLCM));
    }
  }
  return arr;
}

//this needs to change to return an Object
const lcmInput = function(mapArr){
  mapArr.sort(dynamicSort("letter"));
  // console.log('below is the map sorted by letter');
  // console.log(mapArr);
  let arr = [];
  for(let thing of mapArr){
    let str = '';
    str += thing.value;
    let strArr = str.split('/');
    if(strArr.length > 1){
      arr.push(parseInt(strArr[1]));
    } else{
      arr.push(parseInt(str));
    }
  }
  return arr
}

function dynamicSort(property) {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }
    }
}

//////////////////////////////
////////////////////////////
const solve = function(solveNext){
  // console.log('below is solveNext');
  // console.log(solveNext);
  let lowerCaseRegex = /[a-z]/;
  let capitalRegex = /[A-Z]/;
  let numRegex = /[0-9]/;
  let letter = "";

  //find the letter in the string
  for(let i = 0; i < solveNext.length; i++){
    if(solveNext !== undefined){
    if(lowerCaseRegex.test(solveNext[i])===true){
      letter += solveNext[i];
    }
   }
  }
  let eq = algebra.parse(solveNext);
  let theAnswer = eq.solveFor(letter);
  let answerMap = {};
  answerMap['value'] = theAnswer.toString();
  answerMap['letter'] = letter;
  return answerMap;
} //solve end

const solveNext = function(equationsToSolve){
  // console.log('this is the array of equations in solveNext');
  // console.log(equationsToSolve);
    let lowerCaseRegex = /[a-z]/;
  for(let equation of equationsToSolve){
    let letterCount = 0;
    for(let i=0; i < equation.length; i++){
      if(lowerCaseRegex.test(equation[i])===true){
        letterCount++;
      }
   } //for end
   if(letterCount === 1){
     return equation;
     break;
    }
  } //foreach end
};

//BUG try using GCD instead
//https://www.w3resource.com/javascript-exercises/javascript-math-exercise-9.php
const findLCM = function(A) {
    var n = A.length, a = Math.abs(A[0]);
    for (var i = 1; i < n; i++){
      var b = Math.abs(A[i]), c = a;
       while (a && b){ a > b ? a %= b : b %= a; }
       a = Math.abs(c*A[i])/(a+b);
     }
    return a;
}

const setCoefficents = function(object, values){
  for(let side in object){
    let molecules = object[side].molecules;
    for(let molecule of molecules){
      const answer = letterToIndex(values, molecule.coefficent);
      molecule.coefficent = answer;
    }
  }
  return object;
}

const getMoleculesArray = function(equation){
  let arr = [];
    for(let side in equation){
      if (equation[side] instanceof Side){
      for(let molecule of equation[side].molecules){
         let str = '';
         // str += molecule.coefficent;
         for(let atom of molecule.atoms){
           console.log('these are the subscripts');
           console.log(atom.subscript);
           str += atom.name;
           if(atom.subscript !== 1){
           str += atom.subscript;
          }
           console.log('this is the string' + str);
         }
         let map = {};
         map.name = str;
         map.weight = molecule.weight;
         arr.push(map);
       }
     }
  }
  return arr;
}


function letterToIndex(arr, letter){
   switch(letter){
    case 'a': return arr[0];
    case 'b': return arr[1];
    case 'c': return arr[2];
    case 'd': return arr[3];
    case 'e': return arr[4];
    case 'f': return arr[5];
    case 'g': return arr[6];
    case 'h': return arr[7];
    case 'i': return arr[8];
    }
  }

//{}
//put in weight

const finalSolve = function(thingy, weights){
  let next = stringToJSON(thingy, weights);
  let putItIn = createEquations(next);
  console.log('this is putInIn');
  console.log(putItIn);
  let mapLCM = balance(putItIn);
  console.log('this is the mapLCM');
  console.log(mapLCM);
  let arrLCM = lcmInput(mapLCM);
  let theLCM = findLCM(arrLCM);
  let theNewValues=finalValues(mapLCM, theLCM);
  let theNewEquation = setCoefficents(next, theNewValues);
  // console.log('below is what finalSolve returns');
  // console.log(prettyJSON(theNewEquation));
  return theNewEquation;
}


 const getMoleAmount = function(weight, equation, periodicTable, totalCount, count = 0, totalWeight = 0, flag = false){

  if(count === totalCount){
    // console.log('this is the weights array');
    // console.log(weightsArray);
    equation.totalWeight = totalWeight;
    // console.log('this is the total weight ' + equation.totalweight);
    return equation;
  } else {
  let inMoles;
  let answer;
  let newEquation;
  let molesOfFirst;
  let coefficentOfFirst;
  let coefficentOfSecond;
  let howManyMolesOfSecond;
  let massOfSecond;
  for(let side in equation){
    if (equation[side] instanceof Side){
    for(let molecule of equation[side].molecules){
      if(molecule.weight !== null && flag === false){
        flag = true;
        coefficentOfFirst = molecule.coefficent;
        let oneMole = findAtomicMass(periodicTable, molecule);
        molesOfFirst = weight.amount/oneMole;
        totalWeight += weight.amount;
        }
      }
    }
  }
  for(let side in equation){
    if (equation[side] instanceof Side){
    for(let molecule of equation[side].molecules){
      console.log('this is he molecule');
      console.log(molecule);
      if(molecule.weight === null && flag === true){
        coefficentOfSecond = molecule.coefficent;
        console.log('this is the coefficent of first ');
        console.log(coefficentOfFirst);
        console.log('this is the coefficent of second');;
        console.log(coefficentOfSecond);
        let ratio = new Fraction(coefficentOfSecond, coefficentOfFirst);
        howManyMolesOfSecond = molesOfFirst * ratio;
        massOfSecond = findAtomicMass(periodicTable, molecule);
        answer = howManyMolesOfSecond * massOfSecond;
        molecule.weight = answer;
        totalWeight += answer;
        }
      }
    }
  }
   let newCount = count+1;
   flag = true;
  return getMoleAmount(weight, equation, periodicTable, totalCount, newCount, totalWeight, flag);
  }
 } //this is the end

const getTotalCount = function(equation){
  let count = 0;
  for(let side in equation){
    if (equation[side] instanceof Side){
      for(let molecule of equation[side].molecules){
        count++;
      }
  }
 }
  return count;
}

const findAtomicMass = function(periodicTable, molecule){
  const coefficent = molecule.coefficent;
  const atoms = molecule.atoms;
  let total = 0;
  for(let atom of atoms){
    let answer = periodicTable[atom.name] * atom.subscript;
    total += answer;
  }
  return total;
}


function prettyJSON(obj) { console.log(JSON.stringify(obj, null, 2)); }

const solveFromForm = function(theWeight, equationString, periodicTable){
  // console.log('below is the weight coming into solve ');
  // console.log(theWeight);
  let weightsArray = [];
  for(let weight of theWeight){
  const toStoich = finalSolve(equationString, weight, periodicTable);
  const theCount = getTotalCount(toStoich);
  const finalAnswerStoich = getMoleAmount(weight, toStoich, periodicTable, theCount);
  let mapToAppend = {};
  mapToAppend.totalWeight = finalAnswerStoich.totalWeight;
  // console.log('this is the total weight in map to append');
  // console.log(mapToAppend.totalWeight);
  mapToAppend.finalEquation = finalAnswerStoich;
  weightsArray.push(mapToAppend);
  }

  for(let weight of weightsArray){
    console.log('below is the totalWeight');
    console.log(weight.totalWeight);
  }
  let lowestAnswer = weightsArray.sort((obj1, obj2) => {
    return parseInt(obj1.totalWeight) - parseInt(obj2.totalWeight);
  });
  console.log('below is the lowest answer');
  for(let answer of lowestAnswer){
    console.log(answer.totalWeight);
  }
  console.log('below is what it returns');
  console.log(lowestAnswer[0]);
  return lowestAnswer[lowestAnswer.length-1];
}

// let weight = {};
// let weightTwo = {};
// weight.amount = 85;
// weight.whichMolecule = 1;
// weightTwo.amount = 85;
// weightTwo.whichMolecule = 2;
// let theWeight = [];
// theWeight.push(weight);
// theWeight.push(weightTwo);
// // const equationString = 'B5H9+O2=B2O3+H2O';
// const equationString = 'Fe2O3+Al=Al2O3+Fe';
// const holyShit = solveFromForm(theWeight, equationString, periodicTable);
// console.log('below is holy shit');
// console.log(prettyJSON(holyShit));




//steps for stoichiometry
//1.find the atomic mass of one mole the molecule that we know the amount of
//we do this by adding up the atomic masses from the periodic table
//2. divide the amount of the substance we have by the number we just found to get the number of moles that we have
//3. multiply what we found by the coefficent of the molecule we don't have the amount of, this is how many moles we need
//4. find the atomic mass for one mole of the molecule we dont know the amount of
//5. multiply what we found in step 3 and four together


//WHAT WE NEED TO DO:
//get the limiting reagant
//then solve each one recursively



//https://chem.libretexts.org/Textbook_Maps/Inorganic_Chemistry/Supplemental_Modules_(Inorganic_Chemistry)/Chemical_Reactions/Limiting_Reagents
//To find the limiting reagent
//DETAIL you are given the weight of two reactants and you need to find the value of the limiting reagant
//find how many moles of each of the reactants you have
//calculate the mole ratio of the two reactants
//compare the molar ratio to the actual ratio
//the one where theres less is the limiting reagant
//use the ratio of the limiting reagant to fidn the value of the product
module.exports  = {
  solveFromForm,
  getMoleculesArray
}
