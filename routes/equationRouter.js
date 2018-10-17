const express = require('express');
const router = express.Router();
const {MONGODB_URI} = require('../config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Equation = require('../models/equationModel');
const Molecule = require('../models/moleculeModel');
const solveFromForm = require('../solvers/main').solveFromForm;
const periodicTable = require('../solvers/periodicTable').periodicTable;
const getMoleculesArray = require('../solvers/main').getMoleculesArray;
const Side = require('../solvers/classes').Side;

// router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));
const prettyJSON = function(obj) { console.log(JSON.stringify(obj, null, 2)); }

router.post('/', (req, res, next)=>{
  let weight = {};
  let weightTwo = {};
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
  const moleculesArray = getMoleculesArray(holyShit.finalEquation);
  console.log('below us the molecules array');
  console.log(moleculesArray);

  let newEquation = {};
  newEquation.name=equationString;
  newEquation.molecules=[];
  for(let molecule of moleculesArray){
    newEquation.molecules.push(molecule);
  }

  Equation.create(newEquation).then(result =>{
  console.log('below is the new note we created ');
  console.log(result);
  res.json(result);
})
.catch(err =>
    res.status(404).json({ err: 'was not created,' })
     );
  });


router.get('/', (req, res, next) => {
  let filter = {};
  // const userId = req.user.id;
  // filter.userId = userId;

  console.log('Get All Equations');
  Equation.find().populate('molecules')
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
  .catch(err =>
      res.status(404).json({ err: 'was not able to delete' })
    );
  console.log('Delete a Note');
  });


module.exports = router;
