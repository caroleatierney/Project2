// ******************************
// ******* DEPENDENCIES *********
// ******************************
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const app = express()
const db = mongoose.connection
require('dotenv').config()
// ******************************
// ************ PORT ************
// ******************************
const PORT = process.env.PORT

// ******************************
// **********  DATABASE *********
// ******************************
// models
const Soap = require('./models/soap')
const soapSeed = require('./models/soapSeed')

// ******************************
// ***********  MONGO ***********
// ******************************
// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI ,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// ******************************
// ******* ERROR/SUCCESS ********
// ******************************
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// ******************************
// ********  MIDDLEWARE *********
// ******************************
//use public folder for static assets
app.use(express.static('public'));
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

// ******************************
// ***** CONNECT TO HEROKU ******
// ******************************
// test to see if it connects
// app.get('/' , (req, res) => {
//   res.sevnd('Hello World! I am going to be sending soap data to Heroku');
// });

// ******************************
// ** POPULATE WITH SEED DATA ***
// ******************************
// ** remove after running once
// Soap.create( soapSeed, ( err , data ) => {
//       if ( err ) console.log ( err.message )
//           console.log( "added provided soap data" )
//       }
// );

// * * * * * * * * *  * * * * * * * * * * *
// * * * * * * * GET ROUTES * * * * * * * *
// * * * * * * ORDER MATTERS  * * * * * * *
// * * * * * * * * *  * * * * * * * * * * *

// ****************************************
// ************ INDEX ROUTE   *************
// ****************************************
app.get('/soap', (req, res)=>  {
  // res.send('index');
  Soap.find({}, (error, allSoap)=>  {
    res.render(
      'index.ejs',
      {
      soap:allSoap,
      });
  });
});

// ****************************************
// ************** NEW ROUTE ***************
// ****************************************
app.get('/soap/new', (req, res) => {
  // res.send('new soap route');
  res.render(
    'new.ejs'
  )
})

// ****************************************
// *************  EDIT ROUTE   ************
// ****************************************
app.get('/soap/:id/edit', (req, res)=> {
    // res.send('edit route');
    Soap.findById(req.params.id, (err, foundSoap)=>{
        res.render(
    		'edit.ejs',
    		{
          soap: foundSoap,
    		}
    	);
    });
});

// ****************************************
// ************** SHOW ROUTE **************
// ****************************************
// set up soap show route and display parameters of soap selected by user
app.get('/soap/:id', (req, res)=>  {
  // res.send('show');
  // res.send(req.params.id)
  Soap.find({}, (error, allSoap)=>  {
    res.render(
      'show.ejs',
      {
      // soap is a variable
      // soaps[req.params.id] is the value
      soap:allSoap[req.params.id]
      }
    );
  });
});

// ****************************************
// ************* ACTION ROUTES ************
// ****************************************


// ****************************************
// ************** PUT ROUTE ***************
// ****************************************
// posts the change from edit
app.put('/soap/:id', (req, res)=>{
// app.put(':id', (req, res)=>{
    // res.send(req.params.id);

    Soap.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true},
      (err, updatedSoap) => {
        // res.send(updatedSoap);
     res.redirect('/soap');  //redirect to index page
    });
});

// ****************************************
// ********  CREATE "POST" ROUTE   ********
// ****************************************
// creates a new soap
app.post('/soap', (req, res)=> {
  // console.log(req.body);
  // res.send('new soap post route');
  res.send(req.body);

  // Soap.create(req.body, (error, createdSoap) => {
    // res.redirect('/soap');
  // });

// create a new soap object to match the data structure
// of the model.  The data needs to be re-shaped from
// the req.body form

let newSoap = {
    name: req.body.name,
    image: req.body.image,
    percentSuperFat: req.body.percentSuperFat,
    ingredients:
    {
      ingredient1: req.body.ingredient1,
      amount1: req.body.amount1,
      ingredient2: req.body.ingredient2,
      amount2: req.body.amount2,
      ingredient3: req.body.ingredient3,
      amount3: req.body.amount3,
      ingredient4: req.body.ingredient4,
      amount4: req.body.amount4,
      ingredient5: req.body.ingredient5,
      amount5: req.body.amount5,
      ingredient6: req.body.ingredient6,
      amount6: req.body.amount6,
      ingredient7: req.body.ingredient7,
      amount7: req.body.amount7,
      ingredient8: req.body.ingredient8,
      amount8: req.body.amount8
    },
    costPerBar: req.body.costPerBar,
    costPerPound: req.body.costPerPound,
    addCostToGiftWrapPerBar: req.body.addCostToGiftWrapPerBar,
    lyeCalculation:
    {
      minimumWaterNeeded: req.body.minimumWaterNeeded,
      sodiumHydroxide: req.body.sodiumHydroxide,
    },
    totalOilsWeight: req.body.totalOilsWeight,
    totalRecipeWeight: req.body.totalRecipeWeight,
    totalBarsAvail: req.body.totalBarsAvail,
    exfoliating: req.body.exfoliating,
    notes: req.body.notes
  }
  console.log(newSoap)
  // pushes the newSoap object into the databse
  soap.push(newSoap)
  // redirects to soap
  res.redirect('/soap')

});

// ****************************************
// ***********  DELETE ROUTE  *************
// ****************************************
app.delete('/:id', (req, res)=>{
// console.log("in log/delete");
// res.send('deleting...');
  Soap.findByIdAndRemove(
    req.params.id,
    (err, data) => {
    res.redirect('/soap');  //redirect to soap index page
    });
});

// ****************************************
// ************** LISTENER ****************
// ****************************************
app.listen(PORT, () => console.log( 'Listening on port:', PORT));


//  lye calculator function
//  styling
// header
// footer
// nav

// index page styling

// show, new, edit styling - same?

// sign in last thing?
