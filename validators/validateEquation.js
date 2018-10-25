

const validateEquation = function(equation){
  let lowerCaseRegex = /[a-z]/;
let numRegex = /[0-9]/;
let capitalRegex = /[A-Z]/;
let lettersRegex = /^[a-zA-Z]+$/;
let capitalSplit = /(?=[A-Z])/;
if(!containsEquals(equation) || !containsReactantPlus(equation)){
  return false;
} else {
  let sides = equation.split("=");
  let leftMolecules = sides[0].split("+");
  let rightMolecules = sides[1].split("+");
  let equationArray = [...leftMolecules, ...rightMolecules];
  console.log("below is the equation array");
  console.log(equationArray);
   let elementsArray = [];
  for(let molecule of equationArray){
    let firstArray = molecule.split(/([0-9]+)/);
    console.log('below is the first array');
    console.log(firstArray);
    for(let element of firstArray){
      let newElements = element.split(capitalSplit);
      for(let thing of newElements){
         if(lettersRegex.test(thing) === true){
           elementsArray.push(thing);
        }
      }
    }
  }
  console.log('below is the elements array');
  console.log(elementsArray);
    for(let element of elementsArray){
      let validElement = isInPeriodicTable(element);
      if(validElement === false){
        console.log('this is the element it breaks on');
        console.log(element);
        return false;
    }
  }
   return true;
}
}
//

const containsEquals = function(equation){
 for(let char of equation){
   if(char === '='){
     return true;
   }
 }
 // console.log('returning false in containsEquals');
 return false;
}


const containsReactantPlus = function(equation){
 let plusCount = 0;
 let split = equation.split('=');
 for(let char of split[0]){
   if(char === '+'){
     plusCount +=1;
   }
 }
 if(plusCount > 0){
   return true;
 } else {
   // console.log('returning false in containsTwoPlusses');
   return false;
 }
}


const isInPeriodicTable = function(element){
 const periodicTable = {
   "H": 1.008,
   "He": 4.003,
   "Li": 6.94,
   "Be": 8.012,
   "B": 10.81,
   "C": 12.011,
   "N": 14.007,
   "O": 15.999,
   "F": 18.996,
   "Ne": 20.180,
   "Na": 22.990,
   "Mg": 24.305,
   "Al": 26.982,
   "Si": 28.085,
   "P": 40.974,
   "S":32.06,
   "Cl": 35.45,
   "Ar": 39.948,
   "K": 39.098,
   "Ca": 40.078,
   "Sc": 44.956,
   "Ti": 47.876,
   "V": 50.942,
   "Cr": 51.996,
   "Mn": 54.938,
   "Fe": 55.845,
   "Co": 58.933,
   "Ni": 58.693,
   "Cu": 63.546,
   "Zn": 65.38,
   "Ga": 69.723,
   "Ge": 72.630,
   "As": 74.922,
   "Se": 78.97,
   "Br": 79.904,
   "Kr": 83.796,
   "Rb": 85.468,
   "Sr": 87.62,
   "Y": 88.906,
   "Zr": 91.224,
   "Nb": 92.906,
   "Mo": 95.95,
   "Tc": 97,
   "Ru": 101.07,
   "Rh": 102.906,
   "Pd": 106.42,
   "Ag": 107.868,
   "Cd":112.414,
   "In": 114.818,
   "Sn": 118.710,
   "Sb": 121.760,
   "Te": 127.60,
   "I": 126.904,
   "Xe": 131.293,
   "Cs": 132.905,
   "Ba": 137.327,
   "Lu": 174.967,
   "Hf": 178.49,
   "Ta": 180.948,
   "W": 183.84,
   "Re": 186.207,
   "Os": 190.73,
   "Ir": 192.217,
   "Pt": 195.084,
   "Au": 196.996,
   "Hg": 200.592,
   "Tl": 204.38,
   "Pb": 207.2,
   "Bi": 208.960,
   "Po": 209,
   "At": 210,
   "Rn": 222,
   "Fr": 223,
   "Ra": 226,
   "Lr": 262,
   "Rf": 267,
   "Db": 270,
   "Sg": 269,
   "Bh": 270,
   "Hs": 270,
   "Mt": 278,
   "Ds": 281,
   "Rg": 281,
   "Cn": 285,
   "Nh": 286,
   "Fi": 289,
   "Mc": 289,
   "Lv": 293,
   "Ts": 293,
   "Og": 294,
   "La": 138.905,
   "Ce": 140.116,
   "Pr": 140.906,
   "Nd": 144.242,
   "Pm": 145,
   "Sm": 150.36,
   "Eu": 151.964,
   "Gd": 157.25,
   "Tb": 158.925,
   "Dy": 162.500,
   "Ho": 164.930,
   "Er": 167.259,
   "Tm": 168.943,
   "Yb": 173.045,
   "Ac": 227,
   "Th": 232.038,
   "Pa": 231.036,
   "U": 238.029,
   "Np": 237,
   "Pu": 244,
   "Am": 243,
   "Cm":247,
   "Bk": 247,
   "Cf": 251,
   "Es": 252,
   "Fm":257,
   "Md": 258,
   "No": 259
 }
  const atomList = Object.keys(periodicTable);
  for(let atom of atomList){
    if(atom === element){
      return true;
    }
  }
  return false;
}

module.exports = validateEquation;
