const validateMolecules = function(molecules){
  //make sure that the molecule positions are unique
//and that no molecule has a weight of zero
  let positionArray = [];
  for(let molecule of molecules){
    positionArray.push(molecule.whichMolecule);
    if(molecule.amount === 0){
      return false;
    }
  }
  let unique = [...new Set(positionArray)];
  if(unique.toString() === positionArray.toString()){
  return true;
  } else {
  return false;
  }
}

module.exports = validateMolecules;
