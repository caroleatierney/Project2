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
// *************  PUT ROUTE   ************
// ****************************************
// posts the change from edit
app.put('/:id', (req, res)=>{
    res.send(req.params.id);
    // Soap.findByIdAndUpdate(
      // req.params.id,
      // req.body,
      // {new:true},
      // (err, updatedSoap) => {
        // res.send(updatedSoap);
    //  res.redirect('/soap');  //redirect to index page
    // });
});

// ****************************************
// ********  CREATE "POST" ROUTE   ********
// ****************************************
// creates a new soap
app.post('/soap', (req, res)=> {
  // res.send('new soap post route');
  // res.send(req.body);

  Soap.create(req.body, (error, createdSoap) => {
    res.redirect('/soap');
  });
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
