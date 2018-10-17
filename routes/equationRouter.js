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
  let theWeight = [{amount: 85, whichMolecule: 1}, {amount: 85, whichMolecule: 2}];
  let newEquation = {};
  const equationString = 'B5H9+O2=B2O3+H2O';

  const holyShit = solveFromForm(theWeight, equationString, periodicTable);
  console.log('below is holy shit');
  console.log(prettyJSON(holyShit));
  const moleculesArray = getMoleculesArray(holyShit.finalEquation);
  console.log('below us the molecules array');
  console.log(moleculesArray);

  // for(let molecule of moleculesArray){
  //   Molecule.create(molecule).then(result => {
  //     console.log('below is the first result');
  //     console.log(result);
  //      return result;
  //   }).then(result => {
  //     console.log('this is the 2nd result');
  //     console.log(result);
  //     newEquation.molecules.insert(result);
  //   });
  // }
  Molecule.insertMany(moleculesArray).then((result) => {
    console.log('below is insert many');
    console.log(result);
    return result;
  }).then((result)=>{
     newEquation.molecules = result;
     newEquation.name = equationString;
     return Equation.create(newEquation)
   }).then((results) =>{
     res.json(results);
   }).catch((err) =>{
       console.log(err);
       res.status(404).json({ err: 'was not created,' })
    });
 });




  // console.log('below is the official molecules array');
  // console.log(theOfficialMoleculesArray);


  // if(moleculesArray > 0){
  // for(let molecule of theOfficialMoleculesArray){
  //   console.log('below are the molecules in the for loop');
  //   console.log(molecule);
  //   newEquation.molecules.push(molecule);
  // }
// }
//   console.log('below are the molecules pushed in ');
//   console.log(newEquation.molecules);
//
//   Equation.create(newEquation).then(result =>{
//   console.log('below is the new note we created ');
//   console.log(result);
//   res.json(result);
// })
// .catch((err) =>{
//     console.log(err);
//     res.status(404).json({ err: 'was not created,' })
//     });
//   });


router.get('/', (req, res, next) => {
  let filter = {};
  // const userId = req.user.id;
  // filter.userId = userId;
 //you have to pass in the filter to the find function
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
  console.log('Delete an Equation');
  });


module.exports = router;
