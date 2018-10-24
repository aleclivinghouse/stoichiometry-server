const validateLimitingReagant = function(equation, molecules){
  let positionArray = [];
  for(let molecule of molecules){
    positionArray.push(molecule.whichMolecule);
  }
  let theSplit = equation.split("=");
  let reactants = theSplit[0];
  let count = 0;
  for(let char of reactants){
    if(char === '+'){
      count+=1;
    }
  }
  for(let num of positionArray){
    if(num > count){
      return false;
    }
  }
  return true;
}

module.exports = validateLimitingReagant;
