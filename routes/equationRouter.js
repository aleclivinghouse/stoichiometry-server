const express = require('express');
const router = express.Router();
const {MONGODB_URI} = require('../config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const localStrategy = require('../passport/strategies');
const jwtStrategy = require('../passport/jwt');
const Equation = require('../models/equationModel');
const Molecule = require('../models/moleculeModel');
const EquationValidation = require('../validators/validateEquation');
const EquationMolecules = require('../validators/validateMolecules');
const solveFromForm = require('../solvers/main').solveFromForm;
const periodicTable = require('../solvers/periodicTable').periodicTable;
const getMoleculesArray = require('../solvers/main').getMoleculesArray;
const Side = require('../solvers/classes').Side;
const jwtAuth = passport.authenticate('jwt', { session: false });
// router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));
const prettyJSON = function(obj) { console.log(JSON.stringify(obj, null, 2)); }

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));
router.post('/', (req, res, next)=>{
  // let theWeight = [{amount: 85, whichMolecule: 1}, {amount: 85, whichMolecule: 2}];
  // const equationString = 'B5H9+O2=B2O3+H2O';
  const userId = req.user.id;
  console.log('below is the user id');
  console.log(userId);
  let theWeight = req.body.equation.molecules;
  let equationString = req.body.equation.equation;
  let newEquation = {};
  newEquation.userId = userId;

  //validations
  const validatedEquation = EquationValidation(equationString);
  console.log(validatedEquation);
  if(validatedEquation === false){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'not a valid equation'
    });
  }

  const validatedMolecules = EquationMolecules(theWeight);
  if(validatedMolecules === false){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'not valid molecules'
    });
  }

  //calculation
  const calculation = solveFromForm(theWeight, equationString, periodicTable);
  const moleculesArray = getMoleculesArray(calculation.finalEquation);
  console.log('below is the molecules array');
  console.log(moleculesArray);
  newEquation.name = equationString;

 // newEquation.molecules = moleculesArray;
 Equation.create(newEquation).then(equation => {
     for(let molecule of moleculesArray){
       console.log('this is the molecule');
       console.log(molecule);
       equation.molecules.push(molecule);
     }
      return equation.save();
   }).then((result)=> {
     res.json(result);
      }).catch((err) =>{
       console.log(err);
       res.status(404).json({ err: 'was not created,' })
    });
});


router.get('/', (req, res, next) => {
  let filter = {};
  const userId = req.user.id;
  console.log('below is the user id');
  console.log(userId);
  filter.userId = userId;
  console.log('Get All Equations');
  Equation.find(filter).populate('molecules')
    .then(results=>{
        res.send(results);
     }).catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });
  });

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Equation.findByIdAndRemove(id).then(result=>{
    res.status(204).end();
  })
  .catch((err) => {
      console.log('this is the delete server error');
      console.log(err);
      res.status(404).json({ err: 'was not able to delete' })
    });
  console.log('Delete an Equation');
  });


module.exports = router;
