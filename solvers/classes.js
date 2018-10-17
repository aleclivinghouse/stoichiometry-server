class Molecule{
  constructor(coefficent, weight){
    this.coefficent = coefficent;
    this.atoms = [];
    this.weight = weight;
  }
    addAtom(name, subscript){
      this.atoms.push({
        name: name,
        subscript: subscript
      });
    }
    contains(name){
      for(let i = 0; i < this.atoms.length; i++){
        if(this.atoms[i].name === name){
          return true;
          break;
        }
      }
      return false;
    }
  };

class Side{
  constructor(){
  this.molecules = [];
 }
  addMolecule(object){
    this.molecules.push(object);
  }
};

class ChemEquation{
  constructor(reactants, products){
    this.reactants = reactants;
    this.products = products;
  }

};


class aCoefficent{
  constructor(letter){
    this.letter = letter;
    this.value = 0;
    this.solved = false;
  }
  static solve(value){
    this.value = value;
    this.solved = true;
  }
}

module.exports =  { // without default
  Molecule: Molecule,
  ChemEquation: ChemEquation,
  aCoefficent: aCoefficent,
  Side: Side
}
