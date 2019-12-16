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
var PdfReader = require('pdfreader').PdfReader;

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
   var file = os.homedir() + '/' + 'medicalpoc/medical/backend' + '/' + file_name;

  
   fs.appendFile(file_name, req.body.file, (err) => {
      if (err) throw err;

      //console.log(file);
      res.download(file);
   });
   fs.readFile(`${file}`, (err, pdfBuffer) => {
     // pdfBuffer contains the file content
     console.log("file data");

 new PdfReader().parseBuffer(pdfBuffer, function(err, item){
    //  console.log(item.getRawTextContent().indexOf(textToVerify));
      if (err) throw err;
      console.log(item.text);
      
            
           });
        });

 

});
/**
 * 

. org3-crypto.yaml
. docker-compose-org3.yaml
. connection-org3.json
. connection-org3.yaml
. configtx.yaml
step1org3.sh
step2org3.sh
step3org3.sh
utils.sh

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
 */
app.post('/addOrg', async (req, res) => {
   // ./addOrg.sh
   var org_number = 0;
   var chaincodeVersion = req.body.chaincodeversion;
   var port1 = 0;
   var port2 = 0;
   var port3 = 0;
   //var org_name = req;
   console.log(req.body);
   var org_name = req.body.orgname;
   switch (org_name) {
      case "org3":
         // code block
         port1 = 11051;
         port2 = 12051;
         port3 = 11052;
         org_number = 3;
         break;
      case "org4":
         // code block
         port1 = 13051;
         port2 = 14051;
         port3 = 13052;
         org_number = 4;
         break;
      case "org5":
         // code block
         port1 = 15051;
         port2 = 16051;
         port3 = 15052;

         org_number = 5;
         break;
      case "org6":
         // code block
         port1 = 17051;
         port2 = 18051;
         port3 = 17052;

         org_number = 6;
         break;
      case "org7":
         // code block
         port1 = 19051;
         port2 = 20051;
         port3 = 19052;

         org_number = 7;
         break;
      case "org8":
         // code block
         port1 = 21051;
         port2 = 22051;
         port3 = 21052;

         org_number = 8;
         break;
      case "org9":
         // code block
         port1 = 23051;
         port2 = 24051;
         port3 = 23052;

         org_number = 9;
         break;
      case "org10":
         // code block
         port1 = 25051;
         port2 = 26051;
         port3 = 25052;

         org_number = 10;
         break;
      case "org11":
         // code block
         port1 = 27051;
         port2 = 28051;
         port3 = 27052;

         org_number = 11;
         break;
      case "org12":
         // code block
         port1 = 29051;
         port2 = 30051;
         port3 = 29052;

         org_number = 12;
         break;
      default:
      // code block
      port1 = 31051;
      port2 = 32051;
      port3 = 31052;

      org_number = 13;
  
   }
   
   yamlGenerator.generateCrypto(org_name, port1, port2, port3);
   yamlGenerator.generateconnectionyaml(org_name, port1, port2, port3);
   yamlGenerator.generateconnectionjson(org_name, port1, port2, port3);
   yamlGenerator.generateConfigtx(org_name, port1, port2, port3);
   yamlGenerator.generateDockerCompose(org_name, port1, port2, port3);
   //scriptGenerator.generateInstallOrgScript(req, chaincodeVersion);


   var query = `
   cd ../../first-network
   rm -r ${org_name}-artifacts
   rm -r docker-compose-${org_name}.yaml
   rm -r channel-artifacts/${org_name}.json
   rm -r connection-${org_name}.yaml
   rm -r connection-${org_name}.json
   mkdir ${org_name}-artifacts
   cp ../medical/backend/configtx.yaml ${org_name}-artifacts
   cp ../medical/backend/${org_name}-crypto.yaml ${org_name}-artifacts
   cp ../medical/backend/docker-compose-${org_name}.yaml .
   cp ../medical/backend/connection-${org_name}.yaml .
   cp ../medical/backend/connection-${org_name}.json .
   rm -r ../medical/backend/configtx.yaml
   rm -r ../medical/backend/${org_name}-crypto.yaml
   rm -r ../medical/backend/docker-compose-${org_name}.yaml
   rm -r ../medical/backend/connection-${org_name}.yaml
   rm -r ../medical/backend/connection-${org_name}.json

   `;
console.log(query);
   await exec(query).then(function (response) {
      
      
      console.log("exec result : ", response.stdout.search("Error"));
      res.status(200).send("success");
      
   }).catch(function(err){
      throw err;
   });
  
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



