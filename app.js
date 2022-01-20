var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');


const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors())


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get("/proof", (req, res, next) => {
  const address = req.query.address;


  let whitelistAddresses = ["0xEeEbA779ff8D1e9b4adeA39B2D48f210CBee056d", "0x7a1F48E328697460A4ffa8BB2b4C878ece3F54Fb", "0x252fC99297788F58A76cA633088c82Ee0F0Ad960", "0x40f9Cf82069820768008D90D79B28D6b3F905B52", "0x07F4209cdCc28386D573e2E3c78f183e2fab23b4", "0x4B800A1CAbEEc70d0ac4C46af9F3dAb7F85836D8", "0xF169d225c8b98Ae432c6b501fA52650a9cd0d08E", "0x3D59C84b87C290E70b036F75b5E76E00D3497a39", "0xD1bEA81DD97d4fCebc5b25686bdCa04DEFf3991F", "0x4454F16fC4705acf4e43d4d8B12B226795A2a236", "0x9725Fdcf99a66B9FECbaD232b4Eb5B2243bc7fE2", "0xe72eb31b59f85b19499a0f3b3260011894fa0d65", "0x2c29010DE895807649cA2763c510E416618C3F8A", "0x8069841D8451f8D36B85887FB1d831e78caDC4b2", "0x871d68bF6CDfd4d0138dD1D1dc74a1A88aF95A87", "0xb34b03e805F279F4cA48cDb048241848e9Bf4441", "0x9F3DA1e2313a3ee1165908A56aead84bB1A7b1b3", "0x38A4D889a1979133FbC1D58F970f0953E3715c26", "0x9363b477a3E807aF2675695A8B5fD0D1d2C2A89a"];





  const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  
  
  // const dummyaddress = "0x7a1F48E328697460A4ffa8BB2b4C878ece3F54Fb" // threep
  const hashedAddress = keccak256(address);
  const proof = merkleTree.getHexProof(hashedAddress);
  
  const root = merkleTree.getRoot().toString('hex');
  
  console.log("root", root);

  // console.log(merkleTree.verify(proof, hashedAddress, root)) // true
  
  // var joinedstring = ("[" + proof.join(',') + "]");

  res.json(proof);

  // return JSON.stringify(proof)
  // console.log(proof)

 });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
