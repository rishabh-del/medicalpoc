'use strict';

var fs = require('fs');
var os = require('os');
var router = require('./router');
var express = require('express');
var app = express();
var queries = require('./blockchainController/queries');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
var { User } = require('../models/userSchema');
var yamlGenerator = require('../../first-network/generateYaml');
var scriptGenerator = require('../../first-network/generateScript');
const util = require('util');
const exec = util.promisify(require('child_process').exec);




app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../frontend`));
app.use(bodyParser.urlencoded({
   extended: true
}));
// *******remove these once Angular front end is written ********
app.set('views', `${__dirname}/../frontend`); // __dirname is {workspace}/build
app.engine('html', require('ejs').renderFile);


app.set('view engine', 'html');

app.use(router);

app.post('/medicalHistory', async (req, res) => {
   console.log(req.body.patientKey);
   let response = await queries.medicalHistory(req.body.patientKey);
   res.send(response.result);
});

app.post('/allmedicalHistory', async (req, res) => {
   console.log(req.body.patientKey);
   let response = await queries.allmedicalHistory(req.body.patientKey);
   res.send(response.result);
});


app.post('/createMedicalDoc', async (req, res) => {

   var data = {
      key: req.body.patientKey != undefined ? req.body.patientKey : "MED" + Math.random().toString(36).substr(2, 9),
      name: req.body.name,
      age: req.body.age,
      medicine: req.body.medicine,
      file: req.body.file,
      gender: req.body.gender
   }

   let response = await queries.createMedicalDoc(data);
   console.log(response.result);
   if (response.result == "Successfully committed the change to the ledger by the peer") {
      res.send(response.result);
   } else {
      res.send("Error commiting chaincode!");
   }


});

app.post('/downloadReport', async (req, res) => {
   var now = new Date();
   var file_name = 'Report_' + now.getTime() + '.pdf'
   console.log(req.body.file);
   fs.appendFile(file_name, req.body.file, (err) => {
      if (err) throw err;

      var file = os.homedir() + '/' + 'Blockchain/medicalpoc/medical/backend' + '/' + file_name;
      console.log(file);
      res.download(file);
   });



});

app.get('/addOrg', async (req, res) => {
   // ./addOrg.sh
   var req = 'org4';
   var chaincodeVersion = 2;
   yamlGenerator.generateCrypto(req);
   yamlGenerator.generateConfigtx(req);
   yamlGenerator.generateDockerCompose(req);
   scriptGenerator.generateInstallOrgScript(req, chaincodeVersion);
   var query = `
   cd ../../first-network
   rm -r ${req}-artifacts
   rm -r docker-compose-${req}.yaml
   rm -r channel-artifacts/${req}.json
   mkdir ${req}-artifacts
   cp ../medical/backend/configtx.yaml ${req}-artifacts
   cp ../medical/backend/${req}-crypto.yaml ${req}-artifacts
   cp ../medical/backend/docker-compose-${req}.yaml .
   rm -r ../medical/backend/configtx.yaml
   rm -r ../medical/backend/${req}-crypto.yaml
   rm -r ../medical/backend/docker-compose-${req}.yaml
   chmod u=rwx,g=rx,o=r addOrg.sh
   ./addOrg.sh ${req}
   sudo chmod 777 addOrgDocker.sh
   docker cp addOrgDocker.sh cli:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts
   
   docker cp ./channel-artifacts/${req}.json cli:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/
   docker exec cli bash ./scripts/addOrgDocker.sh ${req}
   docker-compose -f docker-compose-${req}.yaml up -d
   sudo chmod 777 addOrgCli.sh

   docker cp addOrgCli.sh ${req}cli:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts
   
   docker exec ${req}cli bash ./scripts/addOrgCli.sh
   chmod u=rwx,g=rx,o=r startFabric.sh
   ./startFabric.sh ${chaincodeVersion}
   `;

   var { stdout, stderr } = await exec(query);
   console.log("exec result : ", stdout, stderr);

})

function renderFunction(req, res) {
   if (renderresponse) {
      res.render('hom.html', renderresponse);
   } else {
      res.render('error.html', renderresponse);
   }
}



/**
 * Mongo connection
 */
//var express=require("express"); 

//
mongoose
   .connect('mongodb+srv://medicalBlock:medPass@cluster0-qq1fv.mongodb.net/test', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
   })
   .then(() => console.log('DB Connected!'))
   .catch(err => {
      console.log("DB Connection Error:");
   });
var db = mongoose.connection;

db.on('error', console.log.bind(console, "connection error"));
db.once('open', function () {
   console.log("connection succeeded");
})




app.post('/loginPage', function (req, res) {
   var email = req.body.email;
   var pass = req.body.password;
   // var userType = req.body.role;
   //console.log("login request",email, pass);
   db.collection('userdata').findOne({
      emailID: { $eq: email }
   }, function (err, result) {
      console.log(result, err);
      if (result == null) {
         res.status(401).send('User Does not exist');
      } else {
         if (result.password == pass) {
            console.log("success", result);
            res.status(200).send(result);
         } else {
            res.status(401).send('Password Does Not Match');
         }

      }
   })

})



app.post('/signup', function (req, res) {
   // var name = req.body.name;
   var email = req.body.email;
   var pass = req.body.password;
   var role = req.body.userType;
   // var phone = req.body.phone;

   console.log(email, pass, role);
   var data = {
      emailID: email,
      password: pass,
      role: role
   }

   console.log('Creating package in mongodb');

   var da = db.collection('userdata').findOne({ emailID: data.emailID }).then(function (response) {
      console.log("da aaya", response);
     
      if (response != null) {
         console.log("user already exists");
         res.status(401).send("User Already Exists!");
      } else {

         db.collection('userdata').insertOne(data, function (err, collection) {
            if (err) throw err;
            console.log("Record inserted Successfully", collection.ops);
            res.status(200).send(collection.ops);
         });

         

      }
   });
   //return res.redirect('login.html');
})


//

app.get('/', function (req, res) {
   res.set({
      'Access-control-Allow-Origin': '*'
   });
   return res.redirect('index.html');
}).listen(3000)


console.log("server listening at port 3000");



