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

router.post('/',  (req, res, next)=>{
  // let theWeight = [{amount: 85, whichMolecule: 1}, {amount: 85, whichMolecule: 2}];
  // const equationString = 'B5H9+O2=B2O3+H2O';
  // const userId = req.user.id;
  // console.log('below is the user id');
  // console.log(req.user.id);
  let theWeight = req.body.equation.molecules;
  let equationString = req.body.equation.equation;
  let newEquation = {};
  // newEquation.userId = userId;
  const holyShit = solveFromForm(theWeight, equationString, periodicTable);
  const moleculesArray = getMoleculesArray(holyShit.finalEquation);
  newEquation.name = equationString;
 // newEquation.molecules = moleculesArray;
 Equation.create(newEquation).then(equation => {
   for(let molecule of moleculesArray){
     equation.molecules.push(molecule)
   }
    return equation.save();
   // return res.json(results)
 }).then((result)=> {
   res.json(result);
 }).catch((err) =>{
       console.log(err);
       res.status(404).json({ err: 'was not created,' })
    });
});


router.get('/', (req, res, next) => {
  let filter = {};
  // const userId = req.user.id;
  // console.log('below is the user id');
  // console.log(userId);
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

router.delete('/:id',  (req, res, next) => {
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
